"""Render db/schema.sql as an ERD. Requires Python and Graphviz on PATH.

Run: python db/generate_erd.py
"""
from pathlib import Path
import re
import shutil
import subprocess

SCHEMA = Path(__file__).resolve().with_name('schema.sql')
ROOT = SCHEMA.parent / 'erd'
ROOT.mkdir(exist_ok=True)
schema_source = SCHEMA.read_text(encoding='utf-8')
sql = re.sub(r'--[^\n]*', '', schema_source)
tables = {}
relations = []

for match in re.finditer(r'CREATE TABLE (\w+) \((.*?)\n\);', sql, re.S):
    name, body = match.groups()
    columns = {}
    for line in body.splitlines():
        m = re.match(r'\s*(\w+) (uuid|text|smallint|bigint|boolean|timestamptz)\b(.*)', line)
        if m:
            col, typ, rest = m.groups()
            columns[col] = {'type': typ, 'required': 'NOT NULL' in rest or 'PRIMARY KEY' in rest,
                            'pk': 'PRIMARY KEY' in rest, 'fk': False, 'generated': 'GENERATED' in rest}
            ref = re.search(r'REFERENCES (\w+)\((\w+)\)', rest)
            if ref:
                relations.append((name, [col], ref[1], [ref[2]]))
    for pk in re.findall(r'^\s*PRIMARY KEY \(([^)]+)\)', body, re.M):
        for col in pk.split(','):
            columns[col.strip()]['pk'] = True
            columns[col.strip()]['required'] = True
    for fk in re.finditer(r'FOREIGN KEY \(([^)]+)\) REFERENCES (\w+)\(([^)]+)\)', body):
        relations.append((name, [c.strip() for c in fk[1].split(',')], fk[2], [c.strip() for c in fk[3].split(',')]))
    tables[name] = columns

for fk in re.finditer(r'ALTER TABLE (\w+) ADD FOREIGN KEY \(([^)]+)\) REFERENCES (\w+)\(([^)]+)\)', sql):
    relations.append((fk[1], [c.strip() for c in fk[2].split(',')], fk[3], [c.strip() for c in fk[4].split(',')]))

assert tables, 'No tables found in schema.sql'
for child, cols, parent, refs in relations:
    assert parent in tables and len(cols) == len(refs)
    for col, ref in zip(cols, refs):
        assert col in tables[child] and ref in tables[parent], (child, col, parent, ref)
        assert tables[child][col]['type'] == tables[parent][ref]['type']
        tables[child][col]['fk'] = True

def render():
    stem = 'carapaws-erd'
    lines = ['digraph ERD {',
        'graph [rankdir=LR, bgcolor="#F5F7FB", pad="0.45", nodesep="0.5", ranksep="1.1", splines=polyline];',
        'node [shape=plain, fontname="Arial", fontsize=12];',
        'edge [color="#8493A7", fontname="Arial", fontsize=10, arrowsize=0.8, dir=both];']
    for name, cols in tables.items():
        color = '#245F69' if name in ('dogs','care_arrangements','care_updates') else '#263F60'
        rows = [f'<TR><TD COLSPAN="3" BGCOLOR="{color}"><FONT COLOR="white"><B>{name}</B></FONT></TD></TR>']
        badges = {'app_users': 'SHARED ACCOUNT: OWNER OR SITTER', 'sitter_profiles': 'SITTER ONLY: EXTRA PROFILE DETAILS', 'dogs': 'BELONGS TO AN OWNER ACCOUNT'}
        if name in badges:
            rows.append(f'<TR><TD COLSPAN="3" BGCOLOR="#DDEFE9"><B>{badges[name]}</B></TD></TR>')
        for col, props in cols.items():
            flags = ('PK ' if props['pk'] else '') + ('FK' if props['fk'] else '')
            flags = flags or '&#160;'
            suffix = ' (generated)' if props['generated'] else ('' if props['required'] else ' ?')
            field = f'{col}{suffix}'
            if name == 'app_users' and col == 'role':
                field = '<B>role: owner | sitter</B>'
            elif props['generated']:
                value = 'owner' if col == 'owner_role' else 'sitter'
                field = f'<B>{col} = {value}</B><BR/>(generated)'
            rows.append(f'<TR><TD ALIGN="LEFT"><FONT COLOR="#245F69">{flags}</FONT></TD><TD PORT="{col}" ALIGN="LEFT">{field}</TD><TD ALIGN="LEFT"><FONT COLOR="#64748B">{props["type"]}</FONT></TD></TR>')
        lines.append(f'{name} [label=<<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="7" BGCOLOR="white">{"".join(rows)}</TABLE>>];')
    for child, cols, parent, refs in relations:
        optional = not all(tables[child][col]['required'] or tables[child][col]['generated'] for col in cols)
        max_one = ((child, parent) in (('sitter_profiles', 'app_users'), ('emergency_contacts', 'dogs')))
        head = 'teeodot' if max_one else 'crowodot'
        tail = 'teeodot' if optional else 'teetee'
        label = cols[0] if child == 'care_updates' or parent == 'media_objects' else ''
        emphasis = ''
        if parent == 'app_users' and child in ('dogs', 'sitter_profiles'):
            label = 'OWNER ONLY' if child == 'dogs' else 'SITTER ONLY: same user ID'
            emphasis = ', color="#245F69", fontcolor="#245F69", penwidth=2'
        if child == 'app_users' and parent == 'media_objects':
            label = 'profile photo (optional)'
            emphasis = ', constraint=false'
        elif child == 'media_objects':
            label = 'uploaded by'
        lines.append(f'{parent} -> {child} [arrowtail={tail}, arrowhead={head}, label="{label}"{emphasis}];')
    lines.append('storage [label=<<TABLE BORDER="0" CELLBORDER="0" CELLPADDING="9" BGCOLOR="#DDEFE9"><TR><TD><B>OBJECT STORAGE (outside database)</B></TD></TR><TR><TD>Private photo files, e.g. MinIO</TD></TR><TR><TD>Located by bucket + object_key</TD></TR></TABLE>>];')
    lines.append('media_objects -> storage [style=dashed, arrowtail=none, arrowhead=vee, label="file location; not a foreign key"];')
    lines.append('}')
    dot = ROOT / (stem + '.dot')
    dot.write_text('\n'.join(lines), encoding='utf-8')
    exe = shutil.which('dot')
    if not exe:
        raise SystemExit('Install Graphviz and add dot to PATH.')
    for fmt in ('svg','png'):
        subprocess.run([exe, '-T'+fmt, '-Gdpi=150', str(dot), '-o', str(ROOT/(stem+'.'+fmt))], check=True)

if __name__ == '__main__':
    render()
    print(f'Validated {len(tables)} tables and {len(relations)} foreign keys; rendered the all-fields ERD.')

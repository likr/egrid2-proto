#!/usr/bin/env python
import sys
import json


def main():
    in_filename = sys.argv[1]
    out_filename = sys.argv[2]
    in_data = json.load(open(in_filename))
    obj = {
        'vertices': [{'u': i, 'd': d}
                     for i, d in enumerate(in_data['nodes'])],
        'edges': [{'u': d['source'], 'v': d['target'], 'd': {}}
                  for d in in_data['links']]
    }
    for d in obj['vertices']:
        d['d']['text'] = d['d']['text'].encode('utf-8')

    json.dump(obj, open(out_filename, 'w'),
              ensure_ascii=False, encoding='utf-8')

if __name__ == '__main__':
    main()

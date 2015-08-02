#!/usr/bin/env python
import sys
import json
import csv


def main():
    in_filename = sys.argv[1]
    out_filename = sys.argv[2]
    in_data = json.load(open(in_filename))
    participants = set()
    for d in in_data['nodes']:
        for p in d['participants']:
            participants.add(p)
    writer = csv.writer(open(out_filename, 'w'))
    writer.writerow(list(participants))
    for d in in_data['nodes']:
        writer.writerow([1 if p in d['participants'] else 0
                         for p in participants])

if __name__ == '__main__':
    main()

#!/usr/bin/env python
from __future__ import print_function
import random


def main():
    for exp in [1, 2]:
        base = 'https://egrid-r.firebaseapp.com/experiment{0}/'.format(exp)
        dataset = [
            {
                'margin': 30,
                'type': 'box'
            },
            {
                'margin': 100,
                'type': 'box'
            },
            {
                'margin': 30,
                'type': 'point'
            },
            {
                'margin': 100,
                'type': 'point'
            }
        ]
        random.shuffle(dataset)
        for i, d in enumerate(dataset):
            print('{0}?dataset={1}&layerMargin={2}&type={3}'
                  .format(base, 'ABCD'[i], d['margin'], d['type']))

if __name__ == '__main__':
    main()

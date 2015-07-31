import React from 'react';
import {connect} from 'redux/react';
import d3scale from 'd3-scale';
import d3cloud from 'd3.layout.cloud';
import kuromojiTokenizer from '../utils/kuromoji-tokenizer';
import {selectVerticesByWord} from '../actions/graph-actions';

const textColor = d3scale.category20();
const textSize = d3scale.linear()
  .range([10, 30]);
const pos = new Set(['名詞', '動詞', '形容詞']);
const stopWords = new Set([
  '*',
  '、',
  'する',
  'れる',
  'いる',
  'やすい',
  'ある',
  'なる',
  'できる',
  'わかる'
]);

@connect((state) => ({
  graph: state.graph
}))
class WordCloud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.graph !== nextProps.graph) {
      const wordCount = new Map();
      kuromojiTokenizer.then((tokenizer) => {
        for (const u of nextProps.graph.vertices()) {
          const centrality = nextProps.graph.vertex(u).centrality;
          for (const word of tokenizer.tokenize(nextProps.graph.vertex(u).text)) {
            const text = word.basic_form;
            if (pos.has(word.pos) && !stopWords.has(text)) {
              if (!wordCount.has(text)) {
                wordCount.set(text, 0);
              }
              wordCount.set(text, wordCount.get(text) + centrality);
            }
          }
        }
        const words = [for ([text, count] of wordCount.entries()) {text, count}];
        words.sort((d1, d2) => d2.count - d1.count);
        textSize.domain([words[words.length - 1].count, words[0].count]);
        d3cloud().size([365, 400])
          .words(words)
          .padding(1)
          .rotate(() => ~~(Math.random() * 2) * 90)
          .font('Impact')
          .fontSize((d) => textSize(d.count))
          .on('end', (layout) => {
            this.setState({
              words: layout
            });
          })
          .start();
      });
    }
  }

  render() {
    const words = this.state.words.map((word) => {
      return (
        <text
            key={word.text}
            onClick={this.handleClickWord.bind(this, word.text)}
            textAnchor="middle"
            transform={`translate(${word.x},${word.y})rotate(${word.rotate})`}
            style={{
              cursor: 'pointer',
              fontSize: `${word.size}px`,
              fontFamily: word.font,
              fill: textColor(word.text)
            }}>
          {word.text}
        </text>
      );
    });
    return (
      <div>
        <h3>Word cloud</h3>
        <svg width="100%" height="400" style={{background: 'white'}}>
          <g transform="translate(182.5,200)">
            {words}
          </g>
        </svg>
      </div>
    );
  }

  handleClickWord(word) {
    this.props.dispatch(selectVerticesByWord(this.props.graph, word));
  }
}

export default WordCloud;

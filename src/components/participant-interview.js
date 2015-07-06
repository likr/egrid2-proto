import angular from 'angular';
import {grid} from 'egrid-core';
import Graph from 'eg-graph/lib/graph';
import SugiyamaLayouter from 'eg-graph/lib/layouter/sugiyama';
import angularfireModule from 'angularfire';
import shinsekaiModule from 'shinsekai';
import commonModules from '../common-modules';
import openAddConstructDialogModule from '../services/open-add-construct-dialog';
import rootRefModule from '../services/root-ref';

const startFrom = ([x, y]) => {
  return `M${x} ${y}`;
};

const lineTo = ([x, y]) => {
  return ` L ${x} ${y}`;
};

const curveTo = ([x1, y1], [x2, y2], ltor) => {
  const dx = x2 - x1,
        dy = y2 - y1;
  return ltor
    ? ` q ${dx / 4} ${0}, ${dx / 2} ${dy / 2} q ${dx / 4} ${dy / 2}, ${dx / 2} ${dy / 2}`
    : ` q ${0} ${dy / 4}, ${dx / 2} ${dy / 2} q ${dx / 2} ${dy / 4}, ${dx / 2} ${dy / 2}`;
};

const svgPath = (points, ltor) => {
  let d = `${startFrom(points[0])}${lineTo(points[1])}`;
  for (let i = 3; i < points.length; i += 2) {
    d += curveTo(points[i - 2], points[i - 1], ltor) + lineTo(points[i]);
  }
  return d;
};

const load = (graph, constructs) => {
  for (const {u, d} of constructs.vertices) {
    graph.addVertex(u, d);
  }
  for (const {u, v, d} of constructs.edges) {
    graph.addEdge(u, v, d);
  }
};

const layout = (constructs) => {
  const graph = new Graph(),
        layouter = new SugiyamaLayouter();
  load(graph, constructs);
  layouter
    .layerMargin(200)
    .vertexMargin(50)
    .vertexWidth(() => 10)
    .vertexHeight(() => 10)
    .edgeWidth(() => 1);
  const positions = layouter.layout(graph);
  const vertices = graph.vertices().map((u) => {
    const d = positions.vertices[u];
    return {
      u: u,
      x: d.x,
      y: d.y,
      height: d.height,
      width: d.width,
      text: graph.vertex(u).text
    };
  });
  const edges = graph.edges().map(([u, v]) => {
    const d = positions.edges[u][v];
    return {
      u: u,
      v: v,
      path: svgPath(d.points, true)
    };
  });
  return {vertices, edges};
};

const template = `
<div style="position: absolute; left: 0; right: 0; top: 64px; bottom: 5px;">
  <svg
      width="100%"
      height="100%"
      ng-mousemove="participantInterview.onMouseMove($event)"
      ng-mousedown="participantInterview.onMouseDown($event)"
      style="cursor: move">
    <g ng-attr-transform="{{participantInterview.svgTranslate}}">
      <g>
        <g
            ng-repeat="edge in participantInterview.layout.edges track by edge.u + ':' + edge.v">
          <path
              fill="none"
              stroke="#ccc"
              ss-d="edge.path"
              ss-d-enter="'M0 0 L0 0 q0 0,0 0 q0 0,0 0 L0 0'"
              ss-dur="0.5"/>
        </g>
      </g>
      <g>
        <g
            class="vertex"
            ss-transform="participantInterview.translate(vertex.x, vertex.y)"
            ss-transform-enter="'translate(0,0)'"
            ss-dur="0.5"
            ng-repeat="vertex in participantInterview.layout.vertices track by vertex.u">
          <circle
              r="5"/>
          <text
              x="7"
              y="5">
            {{vertex.text}}
          </text>
          <foreignObject width="260" height="60" x="-130" transform="scale(0.5)">
            <div>
              <md-button class="md-icon-button" ng-click="participantInterview.ladderUp($event, vertex.u)">
                <md-icon>arrow_back</md-icon>
              </md-button>
              <md-button class="md-icon-button" ng-click="participantInterview.editText($event, vertex.u)">
                <md-icon>edit</md-icon>
              </md-button>
              <md-button class="md-icon-button" ng-click="participantInterview.removeConstruct($event, vertex.u)">
                <md-icon>delete</md-icon>
              </md-button>
              <md-button class="md-icon-button" ng-click="participantInterview.ladderDown($event, vertex.u)">
                <md-icon>arrow_forward</md-icon>
              </md-button>
            </div>
          </foreignObject>
        </g>
      </g>
    </g>
  </svg>
</div>
<div style="position: absolute; left: 0; top: 64px;" layout="column">
  <md-button class="md-fab" ui-sref="app.projects.detail.participant">
    <md-icon>arrow_back</md-icon>
  </md-button>
</div>
<div style="position: absolute; right: 0; top: 64px;" layout="column">
  <md-button class="md-fab" ng-click="participantInterview.addConstruct($event)">
    <md-icon>add</md-icon>
  </md-button>
</div>
`;

const modName = 'egrid.components.participant-interview';

angular.module(modName, [
  angularfireModule,
  shinsekaiModule,
  commonModules,
  openAddConstructDialogModule,
  rootRefModule
]);

angular.module(modName).factory('ParticipantInterviewController', ($firebaseObject, openConstructFormDialog) => {
  const initialValue = '{"vertices": [], "edges": []}';
  const privates = new WeakMap();

  return class ParticipantInterviewController {
    constructor($scope, participant, constructs) {
      const graph = grid();
      const {vertices, edges} = JSON.parse(constructs.$value || initialValue);
      for (const {u, d} of vertices) {
        graph.graph().addVertex(u, d);
      }
      for (const {u, v, d} of edges) {
        graph.graph().addEdge(u, v, d);
      }

      privates.set(this, {
        graph: graph,
        constructs: constructs,
        svgX: 0,
        svgY: 0,
        svgX0: 0,
        svgY0: 0
      });
      this.svgTranslate = this.translate(0, 0);
      this.participant = participant;

      constructs.$loaded(() => {
        this.layout = layout(JSON.parse(constructs.$value || initialValue));
      });
      constructs.$watch((event) => {
        this.layout = layout(JSON.parse(constructs.$value || initialValue));
      });
    }

    addConstruct($event) {
      openConstructFormDialog($event)
        .then(({text}) => {
          const constructs = privates.get(this).constructs,
                graph = grid();
          load(graph.graph(), JSON.parse(constructs.$value || initialValue));
          graph.addConstruct(text);
          constructs.$value = graph.graph().toString();
          constructs.$save();
        });
    }

    ladderDown($event, fromConstruct) {
      openConstructFormDialog($event)
        .then(({text}) => {
          const constructs = privates.get(this).constructs,
                graph = grid();
          load(graph.graph(), JSON.parse(constructs.$value || initialValue));
          graph.ladderDown(fromConstruct, text);
          constructs.$value = graph.graph().toString();
          constructs.$save();
        });
    }

    ladderUp($event, fromConstruct) {
      openConstructFormDialog($event)
        .then(({text}) => {
          const constructs = privates.get(this).constructs,
                graph = grid();
          load(graph.graph(), JSON.parse(constructs.$value || initialValue));
          graph.ladderUp(fromConstruct, text);
          constructs.$value = graph.graph().toString();
          constructs.$save();
        });
    }

    editText($event, u) {
      const constructs = privates.get(this).constructs,
            graph = grid();
      load(graph.graph(), JSON.parse(constructs.$value || initialValue));
      openConstructFormDialog($event, graph.graph().vertex(u).text)
        .then(({text}) => {
          graph.updateConstruct(u, 'text', text);
          constructs.$value = graph.graph().toString();
          constructs.$save();
        });
    }

    removeConstruct($event, u) {
      const constructs = privates.get(this).constructs,
            graph = grid();
      load(graph.graph(), JSON.parse(constructs.$value || initialValue));
      graph.removeConstruct(u);
      constructs.$value = graph.graph().toString();
      constructs.$save();
    }

    onMouseDown($event) {
      const attrs = privates.get(this);
      attrs.svgX0 = $event.clientX;
      attrs.svgY0 = $event.clientY;
    }

    onMouseMove($event) {
      if ($event.buttons > 0) {
        const attrs = privates.get(this);
        attrs.svgX += $event.clientX - attrs.svgX0;
        attrs.svgY += $event.clientY - attrs.svgY0;
        attrs.svgX0 = $event.clientX;
        attrs.svgY0 = $event.clientY;
        this.svgTranslate = this.translate(attrs.svgX, attrs.svgY);
      }
    }

    translate(x, y) {
      return `translate(${x},${y})`;
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.projects.detail.participant.interview', {
    url: '/interview',
    views: {
      'base@app': {
        controllerAs: 'participantInterview',
        controllerProvider: (ParticipantInterviewController) => ParticipantInterviewController,
        template: template
      }
    },
    resolve: {
      constructs: ($stateParams, $firebaseObject, rootRef) => {
        const ref = rootRef
          .child('graph')
          .child($stateParams.projectId);
        return $firebaseObject(ref).$loaded((data) => data);
      }
    }
  });
});

export default modName;

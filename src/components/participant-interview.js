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

const layout = (constructs, oldLayout) => {
  const graph = new Graph(),
        layouter = new SugiyamaLayouter();
  load(graph, constructs);
  layouter
    .layerMargin(200)
    .vertexMargin(80)
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
    const points = positions.edges[u][v] ? positions.edges[u][v].points : positions.edges[v][u].points;
    let oldPoints;
    if (oldLayout) {
      if (oldLayout.positions.edges[u] && oldLayout.positions.edges[u][v]) {
        oldPoints = Array.from(oldLayout.positions.edges[u][v].points);
        if (points.length > oldPoints.length) {
          while (points.length > oldPoints.length) {
            oldPoints.push(oldPoints[oldPoints.length - 1]);
          }
        }
      } else {
        const x1 = oldLayout.positions.vertices[u] ? oldLayout.positions.vertices[u].x : 0,
              y1 = oldLayout.positions.vertices[u] ? oldLayout.positions.vertices[u].y : 0,
              x2 = oldLayout.positions.vertices[v] ? oldLayout.positions.vertices[v].x : 0,
              y2 = oldLayout.positions.vertices[v] ? oldLayout.positions.vertices[v].y : 0;
        oldPoints = [
          [x1, y1],
          [x1, y1],
          [x2, y2],
          [x2, y2]
        ];
      }
    } else {
      oldPoints = points.map(() => [0, 0]);
    }
    return {
      u: u,
      v: v,
      reverse: !positions.edges[u][v],
      pathBefore: svgPath(oldPoints, true),
      path: svgPath(points, true)
    };
  });
  return {vertices, edges, positions};
};

const template = `
<div style="position: absolute; left: 0; right: 0; top: 64px; bottom: 5px;">
  <svg
      width="100%"
      height="100%"
      ng-mousemove="participantInterview.onMouseMove($event)"
      ng-mousedown="participantInterview.onMouseDown($event)"
      style="cursor: move">
    <marker
        id="m_ar"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerUnits="strokeWidth"
        preserveAspectRatio="none"
        markerWidth="8"
        markerHeight="12"
        orient="auto-start-reverse">
      <polygon points="0,0 0,10 10,5" fill="#888"/>
    </marker>
    <g ng-attr-transform="{{participantInterview.svgTranslate}}">
      <g>
        <g
            ng-repeat="edge in participantInterview.layout.edges track by edge.u + ':' + edge.v">
          <path
              fill="none"
              stroke="#ccc"
              ng-attr-stroke-dasharray="{{edge.reverse ? '5' : 'none'}}"
              ss-d="edge.path"
              ss-d-update="edge.pathBefore"
              ss-dur="participantInterview.duration"/>
        </g>
      </g>
      <g>
        <g
            class="vertex"
            ss-transform="participantInterview.translate(vertex.x, vertex.y)"
            ss-transform-enter="'translate(0,0)'"
            ss-dur="participantInterview.duration"
            ng-repeat="vertex in participantInterview.layout.vertices track by vertex.u">
          <circle
              style="cursor: pointer;"
              r="5"
              ss-fill="participantInterview.selected[vertex.u] ? participantInterview.selectedColor : '#000'"
              ng-click="participantInterview.toggleSelected(vertex.u)"/>
          <text
              style="cursor: pointer;"
              x="7"
              y="5"
              ss-fill="participantInterview.selected[vertex.u] ? participantInterview.selectedColor : '#000'"
              ng-click="participantInterview.toggleSelected(vertex.u)">
            {{vertex.text}}
          </text>
          <foreignObject width="195" height="60" x="-90" transform="translate(0,10)scale(0.75)">
            <div>
              <md-button class="md-icon-button" ng-click="participantInterview.ladderUp($event, vertex.u)">
                <md-icon>arrow_back</md-icon>
              </md-button>
              <md-button class="md-icon-button" ng-click="participantInterview.editText($event, vertex.u)">
                <md-icon>edit</md-icon>
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
<div style="position: absolute; left: 0; top: 64px;" layout="row">
  <md-button class="md-fab" ui-sref="app.projects.detail">
    <md-icon>arrow_back</md-icon>
  </md-button>
</div>
<div style="position: absolute; right: 0; top: 64px;" layout="row">
  <md-button class="md-fab" ng-click="participantInterview.addConstruct($event)">
    <md-icon>add</md-icon>
  </md-button>
</div>
<div style="position: absolute; right: 0; bottom: 0;" layout="row">
  <md-button class="md-fab" ng-click="participantInterview.removeSelectedConstruct($event)">
    <md-icon>delete</md-icon>
  </md-button>
  <div ng-switch on="participantInterview.selectedCount">
    <div ng-switch-when="0">
      <md-button class="md-fab" ng-click="participantInterview.selectAll()">
        <md-icon>check_box_outline_blank</md-icon>
      </md-button>
    </div>
    <div ng-switch-default>
      <md-button class="md-fab" ng-click="participantInterview.resetSelect()">
        <md-icon>check_box</md-icon>
      </md-button>
    </div>
  </div>
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

      const x0 = 100,
            y0 = 100;
      privates.set(this, {
        graph: graph,
        constructs: constructs,
        svgX: x0,
        svgY: y0,
        svgX0: x0,
        svgY0: y0
      });
      this.duration = 0.4;
      this.selectedColor = '#dc143c';
      this.svgTranslate = this.translate(x0, y0);
      this.participant = participant;
      this.selectedCount = 0;
      this.selected = {};

      constructs.$loaded(() => {
        this.layout = layout(JSON.parse(constructs.$value || initialValue), this.layout);
      });
      constructs.$watch((event) => {
        this.layout = layout(JSON.parse(constructs.$value || initialValue), this.layout);
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

    removeSelectedConstruct($event) {
      const constructs = privates.get(this).constructs,
            graph = grid();
      load(graph.graph(), JSON.parse(constructs.$value || initialValue));
      for (const u in this.selected) {
        if (this.selected[u]) {
          this.selectedCount -= 1;
          delete this.selected[u];
          graph.removeConstruct(u);
        }
      }
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

    toggleSelected(u) {
      if (this.selected[u]) {
        this.selectedCount -= 1;
        this.selected[u] = false;
      } else {
        this.selectedCount += 1;
        this.selected[u] = true;
      }
    }

    selectAll() {
      const vertices = JSON.parse(privates.get(this).constructs.$value).vertices;
      this.selectedCount = vertices.length;
      for (const {u} of vertices) {
        this.selected[u] = true;
      }
    }

    resetSelect() {
      this.selectedCount = 0;
      for (const u in this.selected) {
        this.selected[u] = false;
      }
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
          .child($stateParams.projectId)
          .child($stateParams.participantId);
        return $firebaseObject(ref).$loaded((data) => data);
      }
    }
  });
});

export default modName;

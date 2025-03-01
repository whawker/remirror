import { isEmptyArray } from '@remirror/core';
import type { Step, StepMap, Transform } from '@remirror/pm/transform';

interface SpanConstructorParameter {
  from: number;
  to: number;
  commit: number | undefined;
}

export class Span {
  from: number;
  to: number;
  commit: number | undefined;

  constructor(parameter: SpanConstructorParameter) {
    const { from, to, commit } = parameter;

    this.from = from;
    this.to = to;
    this.commit = commit;
  }
}

interface CommitConstructorParameter {
  message: string;
  time: number;
  steps: Step[];
  maps: StepMap[];
  hidden?: boolean;
}

export class Commit {
  message: string;
  time: number;
  steps: Step[];
  maps: StepMap[];
  hidden?: boolean;

  constructor(parameter: CommitConstructorParameter) {
    const { message, time, steps, maps, hidden } = parameter;

    this.message = message;
    this.time = time;
    this.steps = steps;
    this.maps = maps;
    this.hidden = hidden;
  }
}

interface TrackStateConstructorParameter {
  blameMap: Span[];
  commits: Commit[];
  uncommittedSteps: Step[];
  uncommittedMaps: StepMap[];
}

export class TrackState {
  blameMap: Span[];
  commits: Commit[];
  uncommittedSteps: Step[];
  uncommittedMaps: StepMap[];

  constructor(parameter: TrackStateConstructorParameter) {
    const { blameMap, commits, uncommittedSteps, uncommittedMaps } = parameter;

    // The blame map is a data structure that lists a sequence of
    // document ranges, along with the commit that inserted them. This
    // can be used to, for example, highlight the part of the document
    // that was inserted by a commit.
    this.blameMap = blameMap;
    // The commit history, as an array of objects.
    this.commits = commits;
    // Inverted steps and their maps corresponding to the changes that
    // have been made since the last commit.
    this.uncommittedSteps = uncommittedSteps;
    this.uncommittedMaps = uncommittedMaps;
  }

  /**
   * Apply a transform to this state.
   */
  applyTransform(transform: Transform): TrackState {
    // Invert the steps in the transaction, to be able to save them in the next
    // commit
    const inverted = transform.steps.map((step, i) => step.invert(transform.docs[i]));
    const newBlame = updateBlameMap({ map: this.blameMap, transform, id: this.commits.length });

    // Create a new state—since these are part of the editor state, a persistent
    // data structure, they must not be mutated.
    return new TrackState({
      blameMap: newBlame,
      commits: this.commits,
      uncommittedSteps: this.uncommittedSteps.concat(inverted),
      uncommittedMaps: this.uncommittedMaps.concat(transform.mapping.maps),
    });
  }

  /**
   * When a transaction is marked as a commit, this is used to put any
   * uncommitted steps into a new commit.
   */
  applyCommit(message: string, time: number): TrackState {
    if (isEmptyArray(this.uncommittedSteps)) {
      return this;
    }

    const commit = new Commit({
      message,
      time,
      steps: this.uncommittedSteps,
      maps: this.uncommittedMaps,
    });

    return new TrackState({
      blameMap: this.blameMap,
      commits: this.commits.concat(commit),
      uncommittedSteps: [],
      uncommittedMaps: [],
    });
  }
}

interface UpdateBlameMapParameter {
  map: Span[];
  transform: Transform;
  id: number;
}

function updateBlameMap({ map, transform, id }: UpdateBlameMapParameter) {
  const result: Span[] = [];
  const mapping = transform.mapping;

  for (const span of map) {
    const from = mapping.map(span.from, 1);
    const to = mapping.map(span.to, -1);

    if (from < to) {
      result.push(new Span({ from, to, commit: span.commit }));
    }
  }

  for (const [index, map] of mapping.maps.entries()) {
    const after = mapping.slice(index + 1);

    map.forEach((_s, _e, start, end) => {
      insertIntoBlameMap({
        map: result,
        from: after.map(start, 1),
        to: after.map(end, -1),
        commit: id,
      });
    });
  }

  return result;
}

interface InsertIntoBlameMapParameter {
  map: Span[];
  from: number;
  to: number;
  commit: number;
}

function insertIntoBlameMap(parameter: InsertIntoBlameMapParameter) {
  const { map, commit } = parameter;
  let { from, to } = parameter;

  if (from >= to) {
    return;
  }

  let pos = 0;
  let next: Span;

  for (; pos < map.length; pos++) {
    next = map[pos];

    if (next.commit === commit) {
      if (next.to >= from) {
        break;
      }

      continue;
    }

    if (next.to <= from) {
      continue;
    }

    // Different commit, not before
    if (next.from < from) {
      // Sticks out to the left (loop below will handle right side)
      const left = new Span({ from: next.from, to: from, commit: next.commit });

      if (next.to > to) {
        map.splice(pos++, 0, left);
      } else {
        map[pos++] = left;
      }
    }

    break;
  }

  while ((next = map[pos])) {
    if (next.commit === commit) {
      if (next.from > to) {
        break;
      }

      from = Math.min(from, next.from);
      to = Math.max(to, next.to);
      map.splice(pos, 1);
      continue;
    }

    if (next.from >= to) {
      break;
    }

    if (next.to > to) {
      map[pos] = new Span({ from: to, to: next.to, commit: next.commit });
      break;
    }

    map.splice(pos, 1);
  }

  map.splice(pos, 0, new Span({ from, to, commit }));
}

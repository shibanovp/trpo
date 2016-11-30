import { Node } from './node';
import {isNull} from 'util';

export class Tree {

  private _root: Node;
  private _p: number = 0; // nodes count;
  private _b: number = 0; // hanging nodes count;
  private _depth: number = 0;
  private nodesArray: Node[] = []; // Links to each Node;
  private hangingNodesArray: Node[] = []; // Links to each hanging Node;

  private _addNTimes(arr: Node[], n: number, node: Node): void {
    for (let i = 0; i < n; ++i) {
      arr.push(node);
    };
  }

  private _buildLevel(buildQueue: Node[]): Node[] {
    let node: Node = null;
    let parent: Node = null;
    let nextBuildQueue: Node[] = [];
    while (buildQueue.length && this._p < this._n) {
      parent = buildQueue.shift();
      node = new Node(this._p + 1, parent, this.calculateExpectedChilds(), this._depth);
      this._p = this.nodesArray.push(node);
      if (isNull(parent)) {
        this._root = node;
      }
      if (node.mi === 0) {
        node.hanging = true;
        this._b = this.hangingNodesArray.push(node);
      }
      this._addNTimes(nextBuildQueue, node.mi, node);
    }
    if (this._p >= this._n) {
      this._hangNodes(this.nodesArray[this._p - 1].level - 1);
      return [];
    }
    if (nextBuildQueue.length) {
      ++this._depth;
    }
    return nextBuildQueue;
  }
  private _hangNodes(lastLevel: number): void {
    for (let i = this._p - 1, node: Node = this.nodesArray[i]; node && lastLevel <= node.level; --i) {
      node = this.nodesArray[i];
      if (node && !node.hasChild && !node.hanging) {
        node.hanging = true;
        this._b = this.hangingNodesArray.push(node);
      }
    }
    this.hangingNodesArray.sort((a: Node, b: Node) => a.id - b.id);
  }
  private calculateExpectedChilds() {
    return this._mIsConst ? this._m : Math.floor(Math.random() * this._m);
  }
  constructor(private _m, private _n, private _stopRule, private _mIsConst) {
    let buildQueue: Node[] = [null]; // Create with null(0) parent
    while (buildQueue.length && this._p < this._n) {
      buildQueue = this._buildLevel(buildQueue);
    }
  }
  get root(): Node {
    return this._root;
  }
  get hangingNodes() {
    return this.hangingNodesArray
      .map((node: Node) => node.stringIdentifier)
      .join(', ');
  }
  get nodes() {
    return this.nodesArray
      .map((node: Node) => node.stringIdentifier);
  }
  get alpha(): number {
    return this._p / this._b;
  }
  get p(): number {
    return this._p;
  }
  get b(): number {
    return this._b;
  }
  get depth(): number {
    return this._depth;
  }
}

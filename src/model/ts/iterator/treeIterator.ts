import { Node } from '../composite/node';
import { Iterator } from './iterator';
import { DoubleLabelNode } from '../composite/doubleLabelNode';

export class TreeIterator implements Iterator {
	private tree: Node[];
	private iterationState: number = 0;

	public constructor(root: Node) {
		this.tree = new Array();
		this.lazyLoader(root);
	}

	public next(): Node | null {
		if (!this.hasNext()) {
			return null;
		}
		return this.tree[this.iterationState++];
	}

	public hasNext(): boolean {
		return this.iterationState < this.tree.length;
	}

	private lazyLoader(root: Node) {
		this.tree.push(root);
		const node = root;
		if (node.isLeaf()) {
			return;
		}
		for (let i = 0; i < (<DoubleLabelNode>node).getChildren().length; i++) {
			this.lazyLoader((<DoubleLabelNode>node).getChildren()[i]);
		}
	}
}

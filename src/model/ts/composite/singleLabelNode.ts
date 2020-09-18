import { HTMLNode } from './htmlNode';
import { Node } from './node';
import { NullIterator } from '../iterator/nullIterator';
import { Iterator } from '../iterator/iterator';

export class SingleLabelNode extends HTMLNode {
	constructor(id: string, type: string, properties: object = {}) {
		super(id, type, properties);
	}

	public isLeaf(): boolean {
		return true;
	}

	public getText(): string {
		return `<${super.getType()} id="${super.getID()}" ${super.propertiesToString()}>\n`;
	}

	public update(node: Node) {
		if (node instanceof SingleLabelNode) {
			super.setID((<SingleLabelNode>node).getID());
			super.setType((<SingleLabelNode>node).getType());
			super.setProperties((<SingleLabelNode>node).getProperties());
		}
	}

	public createIterator(): Iterator {
		return new NullIterator();
	}
}

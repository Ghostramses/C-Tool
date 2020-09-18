import { HTMLNode } from './htmlNode';
import { Node } from './node';
import { TreeIterator } from '../iterator/treeIterator';
import { Iterator } from '../iterator/iterator';

export class DoubleLabelNode extends HTMLNode {
	private children: Node[];

	constructor(id: string, type: string, properties: object = {}) {
		super(id, type, properties);
		this.children = new Array();
	}

	public isLeaf(): boolean {
		return false;
	}

	public getText(): string {
		return `<${super.getType()} id="${super.getID()}" ${super.propertiesToString()}>
                ${this.childToText()}
                </${super.getType()}>\n`;
	}

	public update(node: Node) {
		if (node instanceof DoubleLabelNode) {
			super.setID((<DoubleLabelNode>node).getID());
			super.setType((<DoubleLabelNode>node).getType());
			this.children = (<DoubleLabelNode>node).getChildren();
			super.setProperties((<DoubleLabelNode>node).getProperties());
		}
	}

	public createIterator(): Iterator {
		return new TreeIterator(this);
	}

	public getChildren(): Node[] {
		return this.children;
	}

	public addChild(node: Node) {
		this.children.push(node);
	}

	public removeChild(node: Node) {
		this.children.forEach((child, index) => {
			if (child.getID() === node.getID()) {
				this.children.splice(index, 1);
			}
		});
	}

	public updateChild(node: Node) {
		this.children.forEach(child => {
			if (child.getID() === node.getID()) {
				child = node;
			}
		});
	}

	public setChildren(children: Node[]) {
		this.children = children;
	}

	private childToText(): string {
		let text = '';
		this.children.forEach(child => (text += child.getText()));
		return text;
	}
}

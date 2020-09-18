import { Node } from './node';
import { Iterator } from '../iterator/iterator';
import { NullIterator } from '../iterator/nullIterator';

export class TextNode implements Node {
	private id: string;
	private text: string;

	public constructor(id: string, text: string) {
		this.id = id;
		this.text = text;
	}

	public isLeaf(): boolean {
		return true;
	}

	public getText(): string {
		return this.text;
	}

	public setText(text: string) {
		this.text = text;
	}

	public update(node: Node) {
		if (node instanceof TextNode) {
			this.text = node.getText();
		}
	}

	public getID(): string {
		return this.id;
	}

	public createIterator(): Iterator {
		return new NullIterator();
	}
}

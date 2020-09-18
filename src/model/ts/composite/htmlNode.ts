import { Iterator } from '../iterator/iterator';
import { Node } from './node';

export abstract class HTMLNode implements Node {
	private id: string;
	private type: string;
	private properties: object;

	constructor(id: string, type: string, properties: object = {}) {
		this.id = id;
		this.type = type;
		this.properties = properties;
	}

	public abstract isLeaf(): boolean;

	public abstract getText(): string;

	public abstract update(node: Node);

	public getID(): string {
		return this.id;
	}

	public abstract createIterator(): Iterator;

	public setProperties(properties: object) {
		this.properties = properties;
	}

	public getProperties(): object {
		return this.properties;
	}

	protected propertiesToString(): string {
		let html: string = '';
		for (const property in this.properties) {
			html += `${property}="${this.properties[property]}" `;
		}
		return html;
	}

	protected setID(id: string) {
		this.id = id;
	}

	protected setType(type: string) {
		this.type = type;
	}

	protected getType(): string {
		return this.type;
	}
}

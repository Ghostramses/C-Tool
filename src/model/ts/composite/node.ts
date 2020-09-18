import { Iterator } from './../iterator/iterator';

export interface Node {
	isLeaf(): boolean;
	getText(): string;
	update(node: Node);
	getID(): string;
	createIterator(): Iterator;
}

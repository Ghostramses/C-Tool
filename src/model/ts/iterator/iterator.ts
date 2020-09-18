import { Node } from './../composite/node';

export interface Iterator {
	next(): Node | null;
	hasNext(): boolean;
}

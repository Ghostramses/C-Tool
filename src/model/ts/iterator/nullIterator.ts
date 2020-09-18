import { Iterator } from './iterator';
import { Node } from './../composite/node';

export class NullIterator implements Iterator {
	public next(): Node | null {
		return null;
	}

	public hasNext(): boolean {
		return false;
	}
}

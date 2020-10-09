export interface Generator {
	reset(): void;
	generate(): void;
	getResult(): string;
}

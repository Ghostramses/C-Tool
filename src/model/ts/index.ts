import { HTMLNode } from './composite/htmlNode';
import { DoubleLabelNode } from './composite/doubleLabelNode';
import { TextNode } from './composite/textNode';
import { SingleLabelNode } from './composite/singleLabelNode';

let workspace: DoubleLabelNode = new DoubleLabelNode('workspace', 'main', {
	'data-id': 1
});

workspace.addChild(new TextNode('mensaje1', 'Hola mundo'));
workspace.addChild(
	new SingleLabelNode('escudo', 'img', {
		src: '/home/alfredo/Downloads/pruebas.jpg'
	})
);

let div1: DoubleLabelNode = new DoubleLabelNode('div1', 'div', {
	class: 'row center'
});

let p1: DoubleLabelNode = new DoubleLabelNode('informacion', 'p', {
	class: 'text-center'
});

let p2: DoubleLabelNode = new DoubleLabelNode('informacion', 'p', {
	class: 'text-center'
});

let p3: DoubleLabelNode = new DoubleLabelNode('informacion', 'p', {
	class: 'text-center'
});

let span: DoubleLabelNode = new DoubleLabelNode('informacion', 'span', {
	class: 'text-center'
});

p1.addChild(new TextNode('mensaje2', 'Aqui va un parrafo'));

span.addChild(new TextNode('mensaje3', 'Aqui hay un span'));

p2.addChild(new TextNode('mensaje2', 'Aqui va otro parrafo'));
p2.addChild(span);

div1.addChild(p1);
div1.addChild(p2);

p3.addChild(
	new SingleLabelNode('grafico', 'img', {
		src: '/usr/share/wallpapers/endeavour.png'
	})
);

workspace.addChild(p3);

workspace.addChild(div1);

const iterator = workspace.createIterator();

/*
console.log('--------------------------------');
while (iterator.hasNext()) {
	console.log(iterator.next());
	console.log('--------------------------------');
}
*/

console.log(workspace.getText());

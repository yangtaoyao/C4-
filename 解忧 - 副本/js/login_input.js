
var arr01 = ['a', 'apple', 'abandon', 'bilibili', 'beep', 'before', 'become', 'being', 'highmaintains', 'by', 'bye', 'banana']
var storage = localStorage;
storage.setItem('arr', JSON.stringify(arr01));
var arr = JSON.parse(storage.getItem('arr'));
console.log(JSON.stringify(arr))

document.addEventListener('input', function(event) {

	var _value = event.target.value.trim()

	if(_value) {

		autoComplete(_value, arr)
	} else {

		ul.innerHTML = ''
	}

})

function autoComplete(str, arr) {

	var lis = []

	arr.forEach((word) => {

		if(word.startsWith(str)) {

			lis.push('<li>' + word + '</li>')
		}
	})

	ul.innerHTML = lis.join('')
}

function addToInput(li) {

	var _txt = li.innerText

	input.value = _txt
}

ul.addEventListener('click', function(event) {

	if(event.target.tagName.toLowerCase() === 'li') {

		addToInput(event.target)
	}
})
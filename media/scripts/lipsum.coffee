# DummyText Google Chrome Extension
# http://github.com/davgothic/DummyText
#
# Copyright (c) 2011 David Hancock (http://davgothic.com)
# Licensed under the MIT license (http://davgothic.com/mit-license/)
#

lipsum =
	numParagraphs: if not localStorage["numParagraphs"] then 3 else localStorage["numParagraphs"]
	numWordsPerParagraph: if not localStorage["numWordsPerParagraph"] then 100 else localStorage["numWordsPerParagraph"]
	addParagraphTags: if not localStorage["addParagraphTags"] then "true" else localStorage["addParagraphTags"]
	dummyWords: ["a","ab","ac","accumsan","accusamus","accusantium","ad","adipisci","adipiscing","adipisicing","aenean","alias","aliqua","aliquam","aliquet","aliquid","aliquip","amet","anim","animi","ante","aperiam","aptent","architecto","arcu","asperiores","aspernatur","assumenda","at","atque","auctor","augue","aut","aute","autem","beatae","bibendum","blandit","blanditiis","cillum","class","commodi","commodo","condimentum","congue","consectetuer","consectetur","consequat","consequatur","consequuntur","conubia","convallis","corporis","corrupti","cras","cubilia","culpa","cum","cumque","cupidatat","cupiditate","curabitur","curae","cursus","dapibus","debitis","delectus","deleniti","deserunt","diam","diamlorem","dicta","dictum","dictumst","dignissim","dignissimos","dis","distinctio","do","dolor","dolore","dolorem","doloremque","dolores","doloribus","dolorum","donec","ducimus","dui","duis","ea","eaque","earum","egestas","eget","eius","eiusmod","eleifend","elementum","eligendi","elit","enim","eos","erat","eros","error","esse","est","et","etiam","eu","euismod","eum","eveniet","ex","excepteur","excepturi","exercitation","exercitationem","expedita","explicabo","facere","facilis","facilisi","facilisis","fames","faucibus","felis","fermentum","feugiat","fringilla","fuga","fugiat","fugit","fusce","gravida","habitant","habitasse","hac","harum","hendrerit","hic","hymenaeos","iaculis","id","illo","illum","impedit","imperdiet","in","inceptos","incididunt","incidunt","integer","interdum","inventore","ipsa","ipsam","ipsum","irure","iste","itaque","iure","iusto","justo","labore","laboriosam","laboris","laborum","lacinia","lacus","laoreet","laudantium","lectus","leo","libero","ligula","litora","lobortis","lorem","luctus","maecenas","magna","magnam","magni","magnis","maiores","malesuada","massa","mattis","mauris","maxime","metus","mi","minim","minima","minus","modi","molestiae","molestias","molestie","mollis","mollit","mollitia","montes","morbi","mus","nam","nascetur","natoque","natus","nec","necessitatibus","nemo","neque","nesciunt","netus","nibh","nihil","nisi","nisl","nobis","non","nonummy","nostra","nostrud","nostrum","nulla","nullam","numquam","nunc","occaecat","occaecati","odio","odit","officia","officiis","omnis","optio","orci","ornare","pariatur","parturient","pede","pellentesque","penatibus","per","perferendis","perspiciatis","pharetra","phasellus","placeat","placerat","platea","porro","porta","porttitor","possimus","posuere","potenti","praesent","praesentium","pretium","primis","proident","proin","provident","pulvinar","purus","quae","quaerat","quam","quas","quasi","qui","quia","quibusdam","quidem","quis","quisquam","quisque","quo","quod","quos","ratione","recusandae","reiciendis","rem","repellat","repellendus","reprehenderit","repudiandae","rerum","rhoncus","ridiculus","risus","rutrum","saepe","sagittis","sapien","sapiente","scelerisque","sed","sem","semper","senectus","sequi","similique","sint","sit","sociis","sociosqu","sodales","sollicitudin","soluta","sunt","suscipit","suspendisse","taciti","tellus","tempor","tempora","tempore","temporibus","tempus","tenetur","tincidunt","torquent","tortor","totam","tristique","turpis","ullam","ullamco","ullamcorper","ultrices","ultricies","unde","urna","ut","varius","vehicula","vel","velit","venenatis","veniam","veritatis","vero","vestibulum","vitae","vivamus","viverra","voluptas","voluptate","voluptatem","voluptates","voluptatibus","voluptatum","volutpat","vulputate","wisi"]
	punctuation: ["!","?","."]
	init: ->
		document.getElementById("copy").onclick = ->
			document.getElementById("lipsum").select()
			document.execCommand("Copy")

		document.getElementById("paragraphs").value = @numParagraphs
		document.getElementById("paragraphs").onkeyup = =>
			@saveConfig()
		document.getElementById("paragraphs").onclick = ->
			@.select()

		document.getElementById("words").value = @numWordsPerParagraph
		document.getElementById("words").onkeyup = =>
			@saveConfig()
		document.getElementById("words").onclick = ->
			@.select()

		document.getElementById("ptags").checked = @addParagraphTags is "true"
		document.getElementById("ptags").onclick = =>
			@saveConfig()

		@generateDummyText()

	generateDummyText: ->
		html = "<p>"

		for i in [1..@numParagraphs]
			for j in [1..@numWordsPerParagraph]
				html += @randomWord(@dummyWords)
				if ((j > 0) and (j % @numWordsPerParagraph is 0))
					 html += ".</p>\n\n<p>"
				else
					if html.substring(html.length - 3, html.length) isnt "<p>"
						html += @randomPunctuation(j)

		html += "</p>"
		html = html.replace(/<\/?p>/g, "") if @addParagraphTags isnt "true"
		html = @capitalizeFirst(html.substring(0, html.length - if @addParagraphTags is "true" then 9 else 2));
		document.getElementById("lipsum").innerHTML = html

	saveConfig: ->
		words = document.getElementById("words").value;
		paragraphs = document.getElementById("paragraphs").value;

		@numParagraphs = localStorage["numParagraphs"] = paragraphs if (/\d+/.test(paragraphs))
		@numWordsPerParagraph = localStorage["numWordsPerParagraph"] = words if (/\d+/.test(words))
		@addParagraphTags = localStorage["addParagraphTags"] = document.getElementById("ptags").checked.toString()
		
		@generateDummyText()

	randomWord: (words) ->
		words[@randomInt(words.length)]

	randomPunctuation: (x) ->
		if (x > 0)
			if (x % @randomInt(30) is 0)
				return @randomWord(@punctuation) + " "
			else if (x % @randomInt(20) is 0)
				return ", "
			else
				return " "
		return " "

	randomInt: (x) ->
		Math.floor(Math.random()*parseInt(x))

	capitalizeFirst: (x) ->
		er = /(?:[\n|>|\?|\!|\.]|^)[\s]?([a-z])/g
		x.replace er, (s) ->
			s.toUpperCase()

if window?
	window.lipsum = lipsum

window.onload  = ->
	lipsum.init()

App = {
	picturesInCache:{},

	randomArticles:[
		{
			title: "iMinds/Bell Labs Open Day joint plenary: Wim De Waele, Markus Hofmann, Andrew Keen",
			time: "9:00 - 10:30",
			image: "images/wimdewaele.jpg",
			content: "Wim De Waele is Chief Executive Officer of iMinds, headquartered in Ghent, Belgium. iMinds specializes in interdisciplinary research and development in the software sector, working with companies and other partners on the newest technologies in domains such as networking, media, security and healthcare.<br />Besides his general management duties, he  also leads the market strategy and incubation efforts of iMinds with strong focus on the development of new start-up companies and business acceleration of technology concepts.",
			width: 215

		},
		{
			title: "MiXing things up: should content be a freebie?",
			time: "11:00 - 12:30",
			image: "images/mix.png",
			content: 'The path to Tomorrow\'s Media is studded with questions, doubt, and also fear of the unknown. Each issue evokes a multitude of new questions and uncertainties. Who knows what media consumption will look like in the future? Who knows whether content will maintain its value? And especially; how will it be valorized? What does "online freedom" mean? We kindly invite you to listen to two outspoken opinions on that future. Two passionate people delivering two diverging views. No questions, but answers!',
			width: 215
		},
		{
			title: "Jim McKelvey: Square",
			time: "14:00 - 14:30",
			image: "images/jimmckelvey2.jpg",
			content: "This year Jim McKelvey will be speaking at iMinds. Jim McKelvey is an American computer science engineer and businessperson widely known as the co-founder of Square, a mobile payments company. Square is an electronic payment service, provided by Square Inc. Square allows users in the United States to accept credit cards through their mobile phones, either by swiping the card on the Square device or by manually entering the details on the phone.",
			width: 215
		}
	],

	start: function (){
		console.log("hello world");





		App.articleCollection = new App.ArticleCollection();
		App.articlelistView = new App.ArticlelistView();

/*
		setInterval(function(){
			App.insertRandomArticle();
		},60000)
*/

		// socket.io initialiseren
		App.socket = io.connect(window.location.hostname);

		App.socket.on('wall.newpicture', function (data) {
			App.picturesInCache[data.id] = data.picture; //bewaren om sneller te laden straks
		});

		App.socket.on('wall.publish', function (data) {
			var articleModel = new App.ArticleModel({
				twittername: data.twittername,
				picture:  App.picturesInCache[data.id], //terug ophalen
				subtitle: data.subtitle,
				tweets: data.tweets
			});

			App.articleCollection.add(articleModel);
		});

	},


	insertRandomArticle: function (){
		var randomIndex = Math.floor(Math.random()*App.randomArticles.length);

		var articleModel = new App.ArticleModel(App.randomArticles[randomIndex]);
		App.articleCollection.add(articleModel);
	},

	doSlide: function(){
		  $('#articles').animate({
		    left: '-=1811'
		  }, 1000, function() {
		    // Animation complete.
		  });
	}
};


// Backbone list view
App.ArticlelistView = Backbone.View.extend({
	el: "#articles",

	initialize: function(){
		App.articleCollection.bind("add", this.renderItem, this);
		App.articleCollection.bind("reset", this.renderAll, this);
	},

	renderItem: function(model){
		var self = this;

		// image preloaden:
		var imageObject = new Image();
		imageObject.src = model.get("picture");
		// article pas tonen als image gepreload is:
		imageObject.onload = function(){
			var articleView = new App.ArticleView({model: model});
			var renderedArticle = articleView.render().el;
			$(self.el).append(renderedArticle);
			App.doSlide();
		}
	},

	renderAll: function(collection){
		collection.forEach(this.renderItem, this);
	}
});

//Backbone View:
App.ArticleView = Backbone.View.extend({
	tagName: "div",
	className: "article",

	initialize: function(){
		this.template = $("#article-template");

		this.model.bind('destroy', this.destroy_handler, this);
	},

	render: function(){
		var html = this.template.tmpl(this.model.toJSON());
		$(this.el).html(html);
		return this;
	},

	destroy_handler: function(model){
		console.log("destroy");
		$(this.el).remove();
	}
});

//Backbone Model:
App.ArticleModel = Backbone.Model.extend({
	// required:
	// * title
	// * time
	// * image (url to image)
	// * content
});

// Backbone Collection
App.ArticleCollection = Backbone.Collection.extend({
	model: App.ArticleModel
});

$(App.start);
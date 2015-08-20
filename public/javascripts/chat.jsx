var Comment = React.createClass({
	render: function() {
		return (
			<div className="content">
				<div className={this.props.author === document.cookie.split('=')[1] ? "box center" : ""}></div>
				<div className={this.props.author === document.cookie.split('=')[1] ? "comment mine triangle-right box right" : "comment triangle-right left"}>
					<p className>
						<b className="commentAuthor">
							{this.props.author}
						</b>
						&nbsp;
						<span className="commentMessage">{this.props.text}</span>
					</p>
				</div>
			</div>
		);
	}
});

var CommentBox = React.createClass({
	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				var tmpln = this.state.data.length;
				this.setState({data: data});
				if (tmpln !== data.length) {
					console.log(data.length)
					$('.commentList').each(function() {
					   var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
					   this.scrollTop = scrollHeight - this.clientHeight;
					});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;
		comments.push({'user': comment.author, 'text': comment.text});
		this.setState({data: comments}, function() {
		// `setState` accepts a callback. To avoid (improbable) race condition,
		// we'll send the ajax request right after we optimistically set the new
		// state.
		$.ajax({
			url: '/newmessage',
			dataType: 'json',
			type: 'POST',
			data: {'message': {'user': comment.author, 'text': comment.text}},
			success: function(data) {
				$('.commentList').each(function() {
				   var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
				   this.scrollTop = scrollHeight - this.clientHeight;
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				$('.commentList').each(function() {
				   var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
				   this.scrollTop = scrollHeight - this.clientHeight;
				});
			}.bind(this)
		});
		});
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
		<div className="commentBox">
			<h1>Chat Application</h1>
			<CommentList data={this.state.data} />
			<CommentForm onCommentSubmit={this.handleCommentSubmit} />
		</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment, index) {
			console.log(comment);
			return (
				// `key` is a React-specific concept and is not mandatory for the
				// purpose of this tutorial. if you're curious, see more here:
				// http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
				<Comment author={comment.user} text={comment.text} key={index}></Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var author = document.cookie.split('=')[1];
		var text = React.findDOMNode(this.refs.text).value.trim();
		if (!text || !author) {
			return;
		}
		this.props.onCommentSubmit({author: author, text: text});
		React.findDOMNode(this.refs.text).value = '';
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Say something..." ref="text" id="msg" />
				<input type="submit" value="Send" id="sub" />
			</form>
		);
	}
});

React.render(
	<CommentBox url="/getmessages" pollInterval={2000} />,
	document.getElementById('content')
);
"use strict";

/*global socket*/

$('document').ready(function() {
	$(window).on('action:ajaxify.end', function(err, data) {
		if (data.url.match(/^topic\//)) {
			addHandlers();
			addLabel();
		}
	});

	$(window).on('action:composer.loaded', function(err, data) {
		var item = $('<li><a href="#" data-switch-action="post"><i class="fa fa-fw fa-question-circle"></i> Ask as Question</a></li>');
		$('#cmp-uuid-' + data.post_uuid + ' .action-bar .dropdown-menu').append(item);

		item.on('click', function() {
			$(window).one('action:composer.topics.post', function(ev, data) {
				callToggleQuestion(data.data.tid);
			});
		});
	});

	function addHandlers() {
		$('.toggleQuestionStatus').on('click', toggleQuestionStatus);
		$('.toggleSolved').on('click', toggleSolved);
	}

	function addLabel() {
		require(['components'], function(components) {
			if ($('.topic-unsolved').length) {
				components.get('post/header').prepend('<span class="unanswered"><i class="fa fa-question-circle"></i> 未解决</span>');
			} else if ($('.topic-solved').length) {
				components.get('post/header').prepend('<span class="answered"><i class="fa fa-check-circle"></i> 已解决</span>');
			}
		});
	}

	function toggleQuestionStatus() {
		var tid = ajaxify.variables.get('topic_id');
		callToggleQuestion(tid);
	}

	function callToggleQuestion(tid) {
		socket.emit('plugins.QandA.toggleQuestionStatus', {tid: tid}, function(err, data) {
			app.alertSuccess(data.isQuestion ? '已标记此主题为提问' : '已恢复为普通主题');
			ajaxify.refresh();
		});
	}

	function toggleSolved() {
		var tid = ajaxify.variables.get('topic_id');
		socket.emit('plugins.QandA.toggleSolved', {tid: tid}, function(err, data) {
			app.alertSuccess(data.isSolved ? '已标记此提问为已解决' : '已标记此提问为未解决');
			ajaxify.refresh();
		});
	}
});
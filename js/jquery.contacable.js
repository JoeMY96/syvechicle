/*
 * contactable 1.2.1 - jQuery Ajax contact form
 *
 * Copyright (c) 2009 Philip Beel (http://www.theodin.co.uk/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Revision: $Id: jquery.contactable.js 2010-01-18 $
 *
 */
 
//extend the plugin
(function($){

	//define the new for the plugin ans how to call it	
	$.fn.contactable = function(options) {
		//set default options  
		var defaults = {
			name: 'Name',
			email: 'Email',
			message : 'Message',
			subject : 'A contactable message',
			submit : 'SEND',
			recievedMsg : 'Thank you for your message',
			notRecievedMsg : 'Sorry but your message could not be sent, try again later',
			disclaimer: 'Please feel free to get in touch, we value your feedback',
			hideOnSubmit: false

		};

		//call in the default otions
		var options = $.extend(defaults, options);
		//act upon the element that is passed into the design    
		return this.each(function() {
			//construct the form
			var this_id_prefix = '#'+this.id+' ';
			$(this).html('<div id="contactable_inner"></div><form id="contactForm" method="" action=""><div id="loading"></div><div id="callback"></div><div class="holder"><p><label for="name">'+options.name+'<span class="red"> * </span></label><br /><input id="name" class="contact" name="name"/></p><p><label for="email">'+options.email+' <span class="red"> * </span></label><br /><input id="email" class="contact" name="email" /></p><p><label for="message">'+options.message+' <span class="red"> * </span></label><br /><textarea id="message" name="message" class="message" rows="4" cols="30" ></textarea></p><p><input class="submit" type="submit" value="'+options.submit+'"/></p><p class="disclaimer">'+options.disclaimer+'</p></div></form>');
			//show / hide function
			$(this_id_prefix+'div#contactable_inner').toggle(function() {
				$(this_id_prefix+'#overlay').css({display: 'block'});
				$(this).animate({"marginLeft": "-=5px"}, "fast"); 
				$(this_id_prefix+'#contactForm').animate({"marginLeft": "-=0px"}, "fast");
				$(this).animate({"marginLeft": "+=387px"}, "slow"); 
				$(this_id_prefix+'#contactForm').animate({"marginLeft": "+=390px"}, "slow"); 
			}, 
			function() {
				$(this_id_prefix+'#contactForm').animate({"marginLeft": "-=390px"}, "slow");
				$(this).animate({"marginLeft": "-=387px"}, "slow").animate({"marginLeft": "+=5px"}, "fast"); 
				$(this_id_prefix+'#overlay').css({display: 'none'});
			});
			
			//validate the form 
			$(this_id_prefix+"#contactForm").validate({
				//set the rules for the fild names
				rules: {
					name: {
						required: true,
						minlength: 2
					},
					email: {
						required: true,
						email: true
					},
					message: {
						required: true
					}
				},
				//set messages to appear inline
					messages: {
						name: "",
						email: "",
						message: ""
					},			

				submitHandler: function() {
					$(this_id_prefix+'.holder').hide();
					$(this_id_prefix+'#loading').show();
$.ajax({
  type: 'POST',
  url: options.url,
  data: {subject:options.subject, name:$(this_id_prefix+'#name').val(), email:$(this_id_prefix+'#email').val(), message:$(this_id_prefix+'#message').val()},
  success: function(data){
						$(this_id_prefix+'#loading').css({display:'none'}); 
						if( data == 'success') {
							$(this_id_prefix+'#callback').show().append(options.recievedMsg);
							if(options.hideOnSubmit == true) {
								//hide the tab after successful submition if requested
								$(this_id_prefix+'#contactForm').animate({dummy:1}, 2000).animate({"marginLeft": "-=450px"}, "slow");
								$(this_id_prefix+'div#contactable_inner').animate({dummy:1}, 2000).animate({"marginLeft": "-=447px"}, "slow").animate({"marginLeft": "+=5px"}, "fast"); 
								$(this_id_prefix+'#overlay').css({display: 'none'});	
							}
						} else {
							$(this_id_prefix+'#callback').show().append(options.notRecievedMsg);
							setTimeout(function(){
								$(this_id_prefix+'.holder').show();
								$(this_id_prefix+'#callback').hide().html('');
							},2000);
						}
					},
  error:function(){
						$(this_id_prefix+'#loading').css({display:'none'}); 
						$(this_id_prefix+'#callback').show().append(options.notRecievedMsg);
                                        }
});		
				}
			});
		});
	};
 
})(jQuery);
// 在插件初始化前添加清理代码
$(document).ready(function() {
  $('#contactable').remove(); // 完全移除插件容器
  $('#overlay').remove();     // 清除可能遗留的覆盖层
});

/**
 * The inline script single-screening_form.php prints after the form, as a
 * function of the ACF values it interpolates. Generated from the theme file
 * (scratch converter: PHP text, echo / foreach blocks, PHP's newline-after-?>
 * rule); keep in sync with it.
 */
import type { ScreeningData } from "./types";

export function screeningScript(d: ScreeningData): string {
  return `
	jQuery(document).ready(function($) {
      
      	$('#country_heading').text('${d.sf_country}');
        $('#country_subheading').text('${d.sf_country}');
      
      	$('#get_started').css('background-image', 'url("${d.get_started}")');
      	$('#about_image').css('background-image', 'url("${d.about}")');
      
		$('#passport_image').css('background-image', 'url("${d.passport.image}")');
      	${d.passport.options.map((e) => `      		$('#passport_options').append('<label><span class="wpcf7-list-item-label">${e.answer}</span><input type="radio" name="passport" value="${e.answer}"></label>');
        `).join("")}        
        $('#level_image').css('background-image', 'url("${d.level.image}")');
      	${d.level.options.map((e) => `      		$('#level_options').append('<label><span class="wpcf7-list-item-label">${e.answer}</span><input type="radio" name="english-level" value="${e.answer}"></label>');
        `).join("")}      
		$('#degree_image').css('background-image', 'url("${d.degree.image}")');
      	${d.degree.options.map((e) => `      		$('#degree_options').append('<label><span class="wpcf7-list-item-label">${e.answer}</span><input type="radio" name="degree" value="${e.answer}"></label>');
        `).join("")}      
        $('#age_image').css('background-image', 'url("${d.age.image}")');
      	${d.age.options.map((e) => `      		$('#age_options').append('<label><span class="wpcf7-list-item-label">${e.answer}</span><input type="radio" name="age" value="${e.answer}"></label>');
        `).join("")}      
      	$('#record_image').css('background-image', 'url("${d.record.image}")');
      	${d.record.options.map((e) => `      		$('#record_options').append('<label><span class="wpcf7-list-item-label">${e.answer}</span><input type="radio" name="criminal-record" value="${e.answer}"></label>');
        `).join("")}      
		$('#healthy_image').css('background-image', 'url("${d.healthy.image}")');
      	${d.healthy.options.map((e) => `      		$('#healthy_options').append('<label><span class="wpcf7-list-item-label">${e.answer}</span><input type="radio" name="health" value="${e.answer}"></label>');
        `).join("")}      
        $('#open_image').css('background-image', 'url("${d.open.image}")');
      	${d.open.options.map((e) => `      		$('#open_options').append('<label><span class="wpcf7-list-item-label">${e.answer}</span><input type="radio" name="open-mind" value="${e.answer}"></label>');
        `).join("")}      
      	var show_common_style = 'display:flex;';
        var hide_common_style = 'display:none;';
      
      	var tefl_passport = 0;
      	var tefl_english_level = 0;
		var tefl_degree = 0;
        var tefl_age = 0;
        var tefl_criminal_record = 0;
        var tefl_healthy = 0;
        var tefl_open_mind = 0;
      	var total = 0;
        
        $('.salary-calculator-form .wpcf7-submit').attr('disabled', 'disabled');

        $(document).on('click', '.get-started-btn', function(e) {
            e.preventDefault();
            $('.name-div').attr('style', show_common_style);
            $('.info-text').attr('style', hide_common_style);
        })

        $(document).on('click', '.name-ok-btn', function(e) {
            e.preventDefault();
            $('.tefl-passport-div').attr('style', show_common_style);
            $('.name-div').attr('style', hide_common_style);
        })
      
      	$(document).on('click', 'input[name="passport"]', function(e) {
            if ($('input[name="passport"]').is(':checked')) {
                $('.tefl-passport .wpcf7-list-item').removeClass('checked');
                $(this).parent().parent().addClass('checked');
              	setTimeout(function() {
                  	${d.passport.options.map((e) => `                          	if ($('input[name=passport]:checked', '#passport_options').val() == '${e.answer}') {
                    			tefl_passport = ${e.points};
                          	} 
                    `).join("")}                  
                    $('.tefl-english-level-div').attr('style', show_common_style);
                    $('.tefl-passport-div').attr('style', hide_common_style);
                }, 1000);
            }
        })

        $(document).on('click', 'input[name="english-level"]', function(e) {
            if ($('input[name="english-level"]').is(':checked')) {
                $('.tefl-english-level .wpcf7-list-item').removeClass('checked');
                $(this).parent().parent().addClass('checked');
                setTimeout(function() {
                  	${d.level.options.map((e) => `                          	if ($('input[name=english-level]:checked', '#level_options').val() == '${e.answer}') {
                    			tefl_english_level = ${e.points};
                          	} 
                    `).join("")}                  
                    $('.tefl-degree-div').attr('style', show_common_style);
                    $('.tefl-english-level-div').attr('style', hide_common_style);
                }, 1000);
            }
        })

        $(document).on('click', 'input[name="degree"]', function(e) {
            if ($('input[name="degree"]').is(':checked')) {
                $('.tefl-degree .wpcf7-list-item').removeClass('checked');
                $(this).parent().parent().addClass('checked');
                setTimeout(function() {
                  	${d.degree.options.map((e) => `                          	if ($('input[name=degree]:checked', '#degree_options').val() == '${e.answer}') {
                    			tefl_degree = ${e.points};
                          	} 
                    `).join("")}                  
                    $('.tefl-age-div').attr('style', show_common_style);
                    $('.tefl-degree-div').attr('style', hide_common_style);
                }, 1000);
            }
        })

        $(document).on('click', 'input[name="age"]', function(e) {
            if ($('input[name="age"]').is(':checked')) {
                $('.tefl-age .wpcf7-list-item').removeClass('checked');
                $(this).parent().parent().addClass('checked');
                setTimeout(function() {
                  	${d.age.options.map((e) => `                          	if ($('input[name=age]:checked', '#age_options').val() == '${e.answer}') {
                    			tefl_age = ${e.points};
                          	} 
                    `).join("")}                  
                    $('.tefl-criminal-record-div').attr('style', show_common_style);
                    $('.tefl-age-div').attr('style', hide_common_style);
                }, 1000);
            }
        })

        $(document).on('click', 'input[name="criminal-record"]', function(e) {
            if ($('input[name="criminal-record"]').is(':checked')) {
                $('.tefl-criminal-record .wpcf7-list-item').removeClass('checked');
                $(this).parent().parent().addClass('checked');
                setTimeout(function() {
                  	${d.record.options.map((e) => `                          	if ($('input[name=criminal-record]:checked', '#record_options').val() == '${e.answer}') {
                    			tefl_criminal_record = ${e.points};
                          	} 
                    `).join("")}                  
                    $('.tefl-health-div').attr('style', show_common_style);
                    $('.tefl-criminal-record-div').attr('style', hide_common_style);
                }, 1000);
            }
        })

        $(document).on('click', 'input[name="health"]', function(e) {
            if ($('input[name="health"]').is(':checked')) {
                $('.tefl-health .wpcf7-list-item').removeClass('checked');
                $(this).parent().parent().addClass('checked');
                setTimeout(function() {
                    ${d.healthy.options.map((e) => `                          	if ($('input[name=health]:checked', '#healthy_options').val() == '${e.answer}') {
                    			tefl_healthy = ${e.points};
                          	} 
                    `).join("")}                  	
                  	$('.tefl-open-mind-div').attr('style', show_common_style);
                    $('.tefl-health-div').attr('style', hide_common_style);
                }, 1000);
            }
        })

        $(document).on('click', 'input[name="open-mind"]', function(e) {
            if ($('input[name="open-mind"]').is(':checked')) {
                $('.open-mind .wpcf7-list-item').removeClass('checked');
                $(this).parent().parent().addClass('checked');
              	${d.open.options.map((e) => `                    	if ($('input[name=open-mind]:checked', '#open_options').val() == '${e.answer}') {
                  			tefl_open_mind = ${e.points};
                        } 
                `).join("")}
              	total = parseInt(tefl_passport) + parseInt(tefl_english_level) + parseInt(tefl_degree) + parseInt(tefl_age) + parseInt(tefl_criminal_record) + parseInt(tefl_healthy) + parseInt(tefl_open_mind);
            	console.log('end total: ' + total);
              	document.getElementById("country").value = '${d.sf_country}';
              	document.getElementById("total").value = total;
              
                $('.final-submit-div').attr('style', show_common_style);
                $('.wpcf7-submit').removeAttr('disabled');
            }
        })
      
      	document.addEventListener('wpcf7submit', function(event) {
            if ('77549' == event.detail.contactFormId) {

                $('.salary-calculator-form .wpcf7-response-output').attr('total', total);
                $('.salary-calculator-form .wpcf7-response-output').addClass('ast-row');
                $('.tefl-open-mind-div, .final-submit-div').attr('style', 'display:none;');
                var html_prev_text = '<div class="ast-col-md-6 ast-col-sm-12 img-col"><div style="background-image: url(${d.congratulations_image});"></div></div>';
            var html_txt = '<p class="small-note"><small>* Please note that this form provides an initial screening only and does not guarantee you a position.</small>';
			var html_callback_internships = '<div style="display:flex;justify-content: center;gap: 20px;"><a style="background-color: #09487B;border-radius: 5px;color: white;margin-bottom: 20px !important;font-size: 1rem;padding: 10px 20px;letter-spacing: 0.3px;text-transform: uppercase;" href="/callback">Get a Callback</a><a style="background-color: #000;border-radius: 5px;color: white;margin-bottom: 20px !important;font-size: 1rem;padding: 10px 20px;letter-spacing: 0.3px;text-transform: uppercase;" href="/tefl-internships/">See all Internships</a></div>';
          
            setTimeout(function() {
                if (total < 7) {
                    var response = html_prev_text + '<div class="ast-col-md-6 ast-col-sm-12 content-col"><p>Unfortunately, you do not meet the criteria needed for the ${d.sf_country} Internship. We are sorry about this! Please feel free to get in touch with us if you feel that this is a mistake or you\\'d like to look at other options.</p>' + html_callback_internships + html_txt + '</div>';
                    $('.salary-calculator-form .wpcf7-response-output').html(response);
                } else if (total > 6) {
                    var response = html_prev_text + '<div class="ast-col-md-6 ast-col-sm-12 content-col"><p>Congratulations it looks like you meet all of the requirements for our teaching in ${d.sf_country} Internship. A member of our sales team will give you a call within the next two working days to go through the program in more depth.</p>' + html_txt + '</div>';
                    $('.salary-calculator-form .wpcf7-response-output').html(response);
                }
            }, 200);
            }
        }, false);

      
      	$(document).on('keyup change', 'input[name="your-name"], input[name="last-name"], input[name="your-email"], input[name="phoneNumber"]', function(e) {
            if (($('input[name="your-name"]').val().length !== 0) && ($('input[name="last-name"]').val().length !== 0) && ($('input[name="your-email"]').val().length !== 0)  && ($('input[name="phoneNumber"]').val().length !== 0) ) {
                $('.name-ok-btn').attr('style', 'display:inline-block;');
                if (e.keyCode === 13) {
                    $(".name-ok-btn").click();
                }
            } else {
                $('.name-ok-btn').attr('style', hide_common_style);
            }
        })
      
      	$(document).on('keyup change', 'input[name="phoneNumber"]', function(e) {
            if ($('input[name="phoneNumber"]').val().length >= 10 && $('input[name="phoneNumber"]').val().length <= 15) {
                $('.phone-ok-btn').attr('style', 'display:inline-block;');
                if (e.keyCode === 13) {
                    $(".phone-ok-btn").click();
                }
            } else {
                $('.phone-ok-btn').attr('style', hide_common_style);
            }
        })
    
        var page_url = "${d.url}";
        var page_title = "${d.title}";

        jQuery(document).ready(function($) {
            $("#page_url").val(page_url);
            $("#page_title").val(page_title);
        });

	});
  
`;
}

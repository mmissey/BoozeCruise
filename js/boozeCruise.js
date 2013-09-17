var waitTime = 750;
    	var deck;
    	var suitClass = {
    		'H' : 'hearts',
    		'D' : 'diams',
    		'C' : 'clubs',
    		'S' : 'spades'
    	};
    	var cardVal ={
    		'2' : 2,
    		'3' : 3,
    		'4' : 4,
    		'5' : 5,
    		'6' : 6,
    		'7' : 7,
    		'8' : 8,
    		'9' : 9,
    		'10': 10,
    		'J' : 11,
    		'Q' : 12,
    		'K' : 13,
    		'A' : 14
    	}
    	var pos = 0;
    	var direction = "forward";
    	function newGame(){
    		$('.choice').show();
            $('.hand').empty();
            pos = 0;
    		direction = "forward";
    		deck = new playingCards();
    		deck.shuffle();
    		var card;
    		$.each($('.card'), function(i, v){
    			card = deck.draw();
    			while(card.rank == "N"){card = deck.draw();} //No Jokers
    			displayCard($('#card' + i), card);
    		});
    		updateBoard();
    	}
    	function showResult(dType, callback){
    		$('#drink').bind('click', function(){
	    		$('#drink').unbind('click').hide();
	    		if(callback){
	    			callback();
	    		}
	    	}).show();
            $('#drinkText').text('');
            $('#drink').css('background-color', 'rgba(0,0,255, 0.7)');
            switch(dType){
                case 'river':
                    $('#result').hide();
                    $('#drinkText').text('DRINK FOR THE RIVER!').css('width', '100%');
                break;
                case 'double':
                    hideCards();
                    $('#result').show();
                    setTimeout(function(){
                        $('#drinkText').text('SAME CARD! DRINK DOUBLE!').css('width', '50%');
                        $('#drink').css('background-color', 'rgba(255,0,0, 0.7)');
                        revealCard();
                    }, waitTime);
                    
                break;
                case 'single':
                    hideCards();
                    $('#result').show();
                    setTimeout(function(){
                        $('#drinkText').text('WRONG! DRINK!').css('width', '50%');
                        $('#drink').css('background-color', 'rgba(255,0,0, 0.7)');
                        revealCard();
                    }, waitTime);
                break;
                case 'correct':
                    hideCards();
                    $('#result').show();
                    setTimeout(function(){
                    $('#drinkText').text('CORRECT!').css('width', '50%');
                    $('#drink').css('background-color', 'rgba(0,150,0, 0.7)');
                    revealCard();
                    }, waitTime);
                break;
                case 'finish':
                    $('#result').hide();
                    $('#drinkText').text('You finished with '  + deck.count() + ' cards!').css('width', '100%');
                    $('#drink').css('background-color', 'rgba(0,150,0, 0.7)');
                break;
                case 'gameover':
                    $('#result').hide();
                    $('#drinkText').text('You ran out of cards! You must be hammered!').css('width', '100%');
                    $('#drink').css('background-color', 'rgba(255,0,0, 0.7)');
                break;
            }
    	}

    	function displayCard(elm, card){
    		var rankClass = "rank-" + card.rank;
    		elm.attr('class', "card " + rankClass + " " + suitClass[card.suit]);
    		elm.find('.rank').text(card.rank);
    		elm.find('.suit').html("&"+suitClass[card.suit]+";");
    	}
    	function updateBoard(){
    		$('.card', '.cardContainer').removeClass('selected');
    		$('#card' + pos).addClass('selected').parent('.cardContainer').addClass('selected');

    		$('#currentRank').html($('#card' + pos).find('.rank').text());

    	}
  
    	function newCard(hilo){
            if($('#drink').css('display') == 'block'){
                return false;
            }
    		var newCard = deck.draw();
    		var oldCard = $('#card' + pos);
    		while(newCard !== null && newCard.rank == 'N'){
    			newCard = deck.draw();
    		}
    		if(newCard == null){
    			gameover(true);
    		}
    		var val = cardVal[oldCard.find('.rank').text()];
    		var newVal = cardVal[newCard.rank];
    		var result;
    		if(newVal > val){
    			result = 'higher';
    		}else if( newVal === val){
    			result = 'equal';
    		}else{
    			result = 'lower';
    		}
    		$('#used' + pos).append($('<li>').append(oldCard.clone()));
    		displayCard($('#card' + pos), newCard);
            displayCard($('#resultCard'), newCard);
    		checkCall(result, hilo);
    	}

    	function checkCall(result, hilo){
    		if(result === hilo){
    			handleResult(true, false)
    		}else if (result == 'equal'){
    			handleResult(false, true)
    		}else{
    			handleResult(false, false)
    		}
    	}

    	function handleResult(correct, doubleDrink){
    		if(correct){
    			showResult('correct', nextCard);
    		}else if(doubleDrink){
    			showResult('double', prevCard);
    		}else{
    			//DRINK
    			showResult('single', prevCard);
    		}
    	}

    	function nextCard(){
    		if(direction == "forward"){
    			nextPos = pos += 1;
    			if(nextPos > 6){
    				$("#dirArrow").html("&larr;");
	    			direction = "backwards";
	    			nextPos = 6;
	    		}else if((nextPos == 2)||(nextPos == 5)){
	    			//RIVER
	    			showResult('river');
	    		}
    		}else{
    			nextPos = pos -= 1;
    			if(nextPos < 0){
    				gameover();
    			}else if((nextPos == 1)||(nextPos == 4)){
    				//RIVER
    				showResult('river');
    			}
    		}
    		pos = nextPos;
    		updateBoard();
		}
    	function prevCard(){
    		if(direction == "forward"){
    			nextPos = pos -= 1;
    			if(nextPos < 0){
	    			nextPos = 0;
	    		}else if((nextPos == 1)||(nextPos == 4)){
	    			//RIVER
	    			showResult('river');
	    		}
    		}else{
    			nextPos = pos += 1;
    			if(nextPos > 6){
    				$("#dirArrow").html("&rarr;");
    				direction = "forward";
    				nextPos = 6;
    			}else if((nextPos == 2)||(nextPos == 5)){
    				//RIVER
    				showResult('river');
    			}
    		}
    		pos = nextPos;
    		updateBoard();
    	}
    	function gameover(out){
    		if(out){
    			showResult('gameover');
    		}else{
    			showResult('finish');
    		}
    	}

        function revealCard(){
            $('.back').removeClass('back');
        }
        function hideCards(){
            $('#card' + pos).addClass('back');
            $('#resultCard').addClass('back');
        }

        $(document).keydown(function(e){
            if (e.keyCode == 38) { 
               newCard('higher');
               return false;
            }else if(e.keyCode == 40){
                newCard('lower');
               return false;
            }else if(e.keyCode == 13){
                $('#drink').click();
            } 

        });
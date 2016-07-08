'use strict';

$(() => {

  let socket = io.connect();

  $('#sendButton').click(function() {
    let message = $('#message').val();
    $('#message').val('');
    socket.emit('sendMessage', {message});
  })

  socket.on('newMessage', function(message) {
    console.log('message:', message)
    let $li = $('<li>').text(message);
    $('#chat').append($li);
  });

});

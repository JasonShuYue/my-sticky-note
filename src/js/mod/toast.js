function toast(msg, time) {
    this.msg = msg;
    this.dissmissTime = time || 1000;
    this.createToast();
    this.showToast();
}

Toast.prototype = {
    createToast: function() {
      var template = "<div class='toast'>"+ this.msg +"</div>";

      this.$toast = $(template);
      $('#main-content').append(this.$toast);
    },

    showToast: function() {
        var seft = this;
        this.$toast.fadeIn(300, function() {
            setTimeout(function() {
                self.$toast.fadeOut(300, function() {
                    self.$toast.remove();
                })
            }, self.dissmissTime);
        })
    }
};

function Toast(msg, time) {
    return new toast(msg, time);
}

module.exports.Toast = Toast;
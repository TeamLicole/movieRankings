var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    rating: '',
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	       return !item.completed;
      });
    },
    completedItems: function() {
      return this.items.filter(function(item) {
	       return item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	     return this.items.filter(function(item) {
	        return !item.completed;
	      });
      if (this.show === 'completed')
	     return this.items.filter(function(item) {
         return item.completed;
	     });
      return this.items;
    },
    created: function() {
      this.getItems();
    },
  },
  methods: {
    addItem: function() {
      this.rating = "No rating"
      axios.post("http://localhost:3000/api/items", {
      	text: this.text,
        rating: this.rating,
      	completed: false
      }).then(response => {
      	this.text = "";
        this.rating = "";
      	this.getItems();
      	return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
     axios.put("http://localhost:3000/api/items/" + item.id, {
       text: item.text,
       completed: !item.completed,
       rating: item.rating,
       orderChange: false,
       sortBool: false,
     }).then(response => {
       return true;
     }).catch(err => {
     });
   },
   ratingDown: function(item) {
     if (item.rating < 3) {
       item.rating++;
     }
     axios.put("http://localhost:3000/api/items/" + item.id, {
       text: item.text,
       completed: item.completed,
       rating: item.rating,
       orderChange: false,
       sortBool: false,
     }).then(response => {
       return true;
     }).catch(err => {
     });
    },
   ratingUp: function(item) {
      if (item.rating > 1) {
        item.rating--;
      }
      axios.put("http://localhost:3000/api/items/" + item.id, {
        text: item.text,
        completed: item.completed,
        rating: item.rating,
        orderChange: false,
        sortBool: false
      }).then(response => {
        return true;
      }).catch(err => {
      });
   },
   deleteItem: function(item) {
      axios.delete("http://localhost:3000/api/items/" + item.id).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   showAll: function() {
      this.show = 'all';
   },
   showActive: function() {
      this.show = 'active';
   },
   showCompleted: function() {
      this.show = 'completed';
   },
   deleteCompleted: function() {
      this.items.forEach(item => {
      	if (item.completed)
      	  this.deleteItem(item)
      });
   },
   sort: function() {
      var counter = 0;
      counter = this.sortLoop(1, counter);
      counter = this.sortLoop(2, counter);
      counter = this.sortLoop(3, counter);
   },
   sortLoop: function(value, counter) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].rating == value) {
          console.log(counter, ": ", value, ", ", this.items[i].id);
          this.sortMove(this.items[i], counter);
          counter++;
        }
      }
      return counter;
   },
   sortMove: function(item, counter) {
      axios.put("http://localhost:3000/api/items/" + item.id, {
      	text: item.text,
      	completed: item.completed,
        rating: item.rating,
      	orderChange: true,
        sortBool: true,
      	orderTarget: counter
      }).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   dragItem: function(item) {
      this.drag = item;
   },
   dropItem: function(item) {
      axios.put("http://localhost:3000/api/items/" + this.drag.id, {
      	text: this.drag.text,
      	completed: this.drag.completed,
        rating: this.drag.rating,
      	orderChange: true,
        sortBool: false,
      	orderTarget: item.id
      }).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   getItems: function() {
      axios.get("http://localhost:3000/api/items").then(response => {
      	this.items = response.data;
      	return true;
      }).catch(err => {
      });
   },
  }
});

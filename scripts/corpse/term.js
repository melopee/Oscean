function Term(name,memory)
{
  this.name = name;
  this.diaries = [];
  this.children = [];
  this.parent = null;
  this.logs = [];

  if(memory){
    this.memory = memory;
    this.type = memory.type;
    this.bref = this.memory.bref ? new Runic().markup(this.memory.bref) : "Missing";
    this.long = this.memory.long ? new Runic(this.memory.long).html() : "";
    this.links = this.memory.link ? this.memory.link : [];
    this.flag = this.memory.flag ? this.memory.flag : [];
  }
  
  this.start = function()
  {
    this.diaries = this.find_diaries();
  }

  this.find_diaries = function()
  {
    var a = [];
    for(id in this.logs){
      var log = this.logs[id];
      if(log.photo){
        a.push(log);
      }
    }
    return a;
  }

  // Elements

  this.view = function()
  {
    if(!this.type){ return ""; }
    if(this["_"+this.type.toLowerCase()]){
      return this["_"+this.type.toLowerCase()]();
    }
    console.warn("Missing view:",this.type)
    return "";
  }

  this.h2 = function()
  {
    if(!this.links || this.links.length < 1){ return ""; }
    var html = ""
    for(id in this.links){
      var link = this.links[id]
      html += "<a href='"+link+"'>"+this.format_link(link)+"</a>"
    }
    return html
  }

  this.tree = function()
  {
    var html = "";
    if(this.parent && this.parent.name != this.name){
      var tree_html = ""
      this.parent.start();
      tree_html += "<ln class='parent'><a href='"+this.parent.name+"'>"+this.parent.name.capitalize()+"</a></ln>"
      for(id in this.parent.children){
        var term = this.parent.children[id]
        tree_html += "<ln class='sibling "+(term.name.toLowerCase() == this.name.toLowerCase() ? 'active' : '')+"'>"+term.bref+"</ln>"
        if(term.name.toLowerCase() == this.name.toLowerCase()){
          for(id in this.children){
            var term = this.children[id];
            tree_html += "<ln class='children'>"+term.bref+"</ln>"
          }
        }
      }
      html += "<list class='navi'>"+tree_html+"</list>"
    }
    
    return "<info>"+html+"</info>";
  }

  this.theme = function()
  {
    if(this.diaries.length < 1 || this.flag.indexOf("no_photo") > -1){ return "no_photo"; }    
    return this.diary().theme;
  }

  this.diary = function()
  {
    if(this.diaries.length < 1){ return null; }
    
    for(id in this.diaries){
      if(this.diaries[id].is_featured){ return this.diaries[id]; }
    }
    return this.diaries[0];
  }

  this.photo = function()
  {
    if(this.diaries.length < 1){ return ""; }

    return "url(media/diary/"+this.diary().photo+".jpg)";
  }

  this.preview = function()
  {
    var html = "";

    html += "<a href='"+this.name+"' style='background-image:"+this.photo()+"' class='photo'></a>"
    html += "<p>"+this.bref+"</p>";
    return "<yu class='term'>"+html+"</yu>";
  }

  this.format_link = function(path)
  {
    if(path.indexOf("itch.io") > -1){ return "Itch.io"}
    if(path.indexOf("github") > -1){ return "Github"}
    if(path.indexOf("itunes") > -1){ return "iTunes"}
    if(path.indexOf("youtu") > -1){ return "Youtube"}
    if(path.indexOf("bandcamp") > -1){ return "Bandcamp"}
    if(path.indexOf("drive.google") > -1){ return "Google Drive"}

    return "Website"
  }

  // Views

  this._portal = function()
  {
    var html = ""
    for(id in this.children){
      var term = this.children[id];
      term.start();
      html += term.preview();
    }
    return html;
  }

  this._docs = function()
  {
    var content = invoke.vessel.storage[this.name];
    if(!content){ return "Missing:"+this.name; }
    return content.html();
  }

  this._special = function()
  {
    var content = invoke.vessel.storage[this.name];
    if(!content){ return "Missing:"+this.name; }
    return content.html();
  }

  this._diary = function()
  {
    var html = "";

    for(id in this.diaries){
      var diary = this.diaries[id];
      html += "<img src='media/diary/"+diary.photo+".jpg'/>"
    }
    return html;
  }
}

function MissingTerm(name)
{
  Term.call(this,name)

  this.bref = "Sorry! There are no pages found for "+this.name+" in this Lexicon."
  this.long = "<p>If you think that this is an error, contact <a href='https://twitter.com/neauoire'>@aliceffekt</a>.</p>";
}

invoke.vessel.seal("corpse","term");

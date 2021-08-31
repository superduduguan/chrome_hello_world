site = "http://nanyangpt.com/torrents.php?search=\nhttp://npupt.com/torrents.php?search=\nhttps://bt.byr.cn/torrents.php?search=\nhttps://kp.m-team.cc/torrents.php?search=\nhttps://pt.eastgame.org/torrents.php?search=\n";
sites = site.split('\n')

// get popup and create
chrome.extension.onConnect.addListener(function(port){
    // connecting
    console.log("Connected");
    // port.postMessage(sites)

    //listen for message
    port.onMessage.addListener(function(msg) {
        console.log("message recieved " + msg);
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tabindex = tabs[0].index;
            console.log(tabindex);
            for(site in sites){
                if(sites[site]){
                    var newindex = parseInt(tabindex) + parseInt(site) + 1;
                    console.log(newindex);
                    if(site == 0){
                        chrome.tabs.create({url: sites[site] + msg, index:newindex});
                    }
                    else{
                        chrome.tabs.create({url: sites[site] + msg, index:newindex, active:false});
                    }
                }
            }
        });
        
    });
});


chrome.runtime.onMessage.addListener(function(request, sender)
{
	console.log('收到来自content-script的消息：');
    // console.log(request, sender);
    if(request.site == 'doubansub'){
        var name = sender.tab.title.slice(start=0, end=-4);
        var id = sender.tab.url.split('/')[4]
        console.log('name:', name);
        console.log('id:', id);

        $.ajax(
            {
                url:"https://movie.douban.com/j/subject/"+id+"/interest",
                type:'post',
                dateType:'json',
                headers:{'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'},
                data:{ck:'8OhY',interest:'wish',foldcollect:'U'},
                success:function(data){console.log("sucess");},
                error:function(data){console.log("error");}
            }
        );
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tabindex = tabs[0].index;
            console.log(tabindex);
            for(site in sites){
                if(sites[site]){
                    var newindex = parseInt(tabindex) + parseInt(site) + 1;
                    // console.log(newindex);
                    if(site == 0){
                        chrome.tabs.create({url: sites[site] + name, index:newindex});
                    }
                    else{
                        chrome.tabs.create({url: sites[site] + name, index:newindex, active:false});
                    }
                }
            }
            
        });
        
    }

    if(request.site == 'doubanlist'){
        var name = request.name
        var id = request.id;
        console.log(name);
        console.log(id);
        $.post("https://movie.douban.com/j/subject/"+id+"/interest",{ck:'No3N',interest:'wish',foldcollect:'U'},function(data,status){console.log(status);})
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tabindex = tabs[0].index;
            console.log(tabindex);
            for(site in sites){
                if(sites[site]){
                    var newindex = parseInt(tabindex) + parseInt(site) + 1;
                    console.log(newindex);
                    if(site == 0){
                        chrome.tabs.create({url: sites[site] + name, index:newindex});
                    }
                    else{
                        chrome.tabs.create({url: sites[site] + name, index:newindex, active:false});
                    }
                }
            }
        });
    }
    return true;
});


// right click
var index = new Array();
chrome.contextMenus.create({
	title: 'Search on PT sites：%s', // %s表示选中的文字
	contexts: ['selection','link'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params)
	{
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tabindex = tabs[0].index;
            console.log(tabindex);
            for(site in sites){
                if(sites[site]){
                    var newindex = parseInt(tabindex) + parseInt(site) + 1;
                    console.log(newindex);
                    if(site == 0){
                        chrome.tabs.create({url: sites[site] + encodeURI(params.selectionText), index:newindex});
                    }
                    else{
                        chrome.tabs.create({url: sites[site] + encodeURI(params.selectionText), index:newindex, active:false});
                    }
                }
            }
        });
    }
});


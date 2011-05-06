;
(function($)
{
    $.fn.imageAnimate = function(options)
    {
        var defaults = {
            itemHeight : 50,
            itemWidth : 50,
            imageUrl : ["1_b.jpg", "2_b.jpg", "3_b.jpg"]
        };
        var opts = $.extend({}, defaults, options);
        var self = $(this);
        /*
        for(var i = 0, len = opts.imageUrl.length; i < len; i++)
        {
            self.append(createImageContainer.call(self, 10, 6, opts.imageUrl[i]));
        }
        */
        self.append(createImageContainer.call(self, 10, 6, opts.imageUrl[0]));
        self.append(createImageContainer.call(self, 10, 6, opts.imageUrl[1]));
        self.append(createImageContainer.call(self, 10, 6, opts.imageUrl[2]));
        imageAnimate.call(self);
    }
    
    function imageAnimate()
    {        
        var self = this;
        var imageContainer = self.children(".uiImageContainer:last");
        var imgItemList = imageContainer.children(".uiImageItem");
        palindromeAnimate.call(self, imgItemList);
        /*
        var randomImgItem = getRandomImgItemList(imageContainer, 30);
        $(randomImgItem[0]).animate({height : 0}, 2000);
        $(randomImgItem[1]).animate({width : 0}, 2000, function()
        {
            imageContainer.remove();
            imageAnimate.call(self);
        });
        */
    }
    /*由最后一个元素往第一个元素绕圈显示*/
    function palindromeAnimate(imgItemList)
    {
        var self = this;        
        var itemWidth = imgItemList.eq(0).width();
        var itemHeight = imgItemList.eq(0).height();
        var itemArray = $.makeArray(imgItemList);
        var newItemArray = createPalindromeItemList.call(self, itemArray).reverse();;
        var total = newItemArray.length;
        function animateFunc(itemArr, index)
        {
            var item = itemArr[index];
            var changeProp = {};
            if(item.palindromeAnimate === 0)
            {
                changeProp.width = 0;
            }
            else if(item.palindromeAnimate === 1)
            {
                changeProp.marginLeft = itemWidth + 5;
                changeProp.width = 0;
            }
            else if(item.palindromeAnimate === 2)
            {
                changeProp.height = 0;
            }
            else if(item.palindromeAnimate === 3)
            {
                changeProp.height = 0;
                changeProp.marginTop = itemHeight + 5;
            }
            $(itemArr[index]).animate(changeProp, 30, function()
            {
                if(index > 0)
                {
                    animateFunc(itemArr, index - 1);
                }
            });
        }
        animateFunc(newItemArray, total - 1);
    }
    
    function createPalindromeItemList(itemArray)
    {
        var self = this;
        var item = $(itemArray[0]);
        var totalX = self.width() / item.width();
        var totalY = self.height() / item.height();
        var newItemArr = [];
        
        var total = totalX * totalY;
        var currentIndex = total;
        var offsetX = -1;
        var offsetY = -totalX;
        var xMove = true;
        var xMoveStepMax = totalX;
        var yMoveStepMax = totalY - 1;
        var moveStep = 0;
        var indexArr = [];
        for(var i = 0; i < total; i++)
        {
            if(xMove)
            {
                moveStep++;
                currentIndex += offsetX;
                if(moveStep == xMoveStepMax)
                {
                    offsetX = -offsetX;
                    xMoveStepMax--;
                    xMove = false;           
                    moveStep = 0;
                }                    
            }
            else
            {
                moveStep++;
                currentIndex += offsetY;
                if(moveStep == yMoveStepMax)
                {
                    offsetY = -offsetY;
                    yMoveStepMax--;
                    xMove = true;
                    moveStep = 0;
                }
            }
            var item = itemArray[currentIndex];
            if(xMove)
            {
                item.palindromeAnimate = 0;
                if(offsetX > 0)
                {
                    item.palindromeAnimate = 1;
                }
            }
            else
            {
                item.palindromeAnimate = 2;
                if(offsetY > 0)
                {
                    item.palindromeAnimate = 3;
                }
            }
            newItemArr.push(item);
        }
        return newItemArr;
        
    }
    
    function createImageContainer(totalX, totalY, imageUrl)
    {
        var self = this;
        var html = '<div class="uiImageContainer"></div>';
        var itemWidth = self.width() / totalX;
        var itemHeight = self.height() / totalY;        
        var container = $(html);
        var itemHtml = '<div class="uiImageItem" style="width:' + itemWidth + 'px;height:' + itemHeight + 'px;"></div>';
        for(var i = 0; i < totalY; i++)
        {
            for(var j = 0; j < totalX; j++)
            {
                var leftValue = itemWidth * j;
                var topValue = itemHeight * i;
                var backgroundStr = "url(" + imageUrl + ") " + (-leftValue) + "px " + (-topValue) + "px";
                container.append($(itemHtml).css({background : backgroundStr, left : leftValue, top : topValue}));
            }
        }
        return container;
    }
    
    function getRandomImgItemList(imageContainer, separate)
    {
        var imgListArr = $.makeArray(imageContainer.children(".uiImageItem"));
        randomSort(imgListArr);
        var listObj = {
            "0" : imgListArr.slice(0, separate),
            "1" : imgListArr.slice(separate)
        };
        return listObj;
    }
    

    function randomSort(arr)
    {
        for(var i = arr.length; i > 1; i--)
        {
            var index = Math.floor(Math.random() * i);
            var tmp = arr[i - 1];
            arr[i - 1] = arr[index];
            arr[index] = tmp;
        }
    }
})(jQuery);

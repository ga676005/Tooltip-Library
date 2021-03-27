# Tooltip-Library
## Demo 連結: https://gogotooltip.netlify.app/
- 用鍵盤上下左右移動元素。

---

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t0g4o8mr2hn2r9rqof85.png)

---

###### 介紹: Tooltip-Library是在線上課程中學到的，它的主軸是在提示框的顯示位置超出邊界時自動調整，[這是它原本的樣子](https://nifty-morse-97e6a4.netlify.app/)，原本支援四個方位，我再加上四個方位和箭頭，一開始箭頭是用border做的，定位箭頭的方式很粗糙，後來在開發gogotrello時，為了要一起展示這個作品有了很多想法，因此做了升級，除了降低地位箭頭的複雜度、加上特效、更增加了許多自訂功能。
在[dev.to](https://dev.to/ga676005/my-first-library-a6i)的分享

功能:
- *data-positions* 設定顯示順位，支援八個方位，在空間不夠顯示時，會依照設定變換位置。
- *data-bg-color* 背景色。
- *data-fg-color* 字體色。
- *data-tooltip* 內容。
- *data-arrow* 支援其他指向為**上/下/左/右**的箭頭[HTML code](https://www.toptal.com/designers/htmlarrows/arrows/)，依照指向設定*data-arrow-direction*，如果您不喜歡箭頭，也可以選擇不要。
- *data-spacing* tooltip跟元素的間距。
- *data-font-size* 字體大小。
- *data-arrow-size* 箭頭大小。
- 只要設定data-tooltip就有最基本的樣式。

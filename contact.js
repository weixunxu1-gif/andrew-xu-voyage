const contactDetails = {
  email: "23300680091@m.fudan.edu.cn",
  phone: "+86 156 1814 3829",
  linkedin: "https://www.linkedin.com/in/weixun-xu-59a651387",
  instagram: "https://www.instagram.com/andrewxu_10/"
};

function renderContact(language) {
  const isChinese = language === "zh";
  const copy = isChinese ? {
    title: "联系我", email: "邮箱", phone: "电话", linkedin: "查看 LinkedIn 主页",
    resume: "在线简历", resumeLink: "查看中英文简历", wechat: "微信",
    wechatQR: "查看微信二维码原图", instagramQR: "查看 Instagram 二维码原图"
  } : {
    title: "Contact", email: "Email", phone: "Phone", linkedin: "View LinkedIn profile",
    resume: "Online résumé", resumeLink: "View Chinese and English résumés", wechat: "WeChat",
    wechatQR: "View full-size WeChat QR code", instagramQR: "View full-size Instagram QR code"
  };
  const resumeUrl = isChinese ? "resume.html" : "resume.html?lang=en";
  document.querySelector("#contact").innerHTML = `
    <h2 id="contact-title">${copy.title}</h2>
    <div class="contact-grid">
      <dl class="contact-details">
        <div><dt>${copy.email}</dt><dd><a href="mailto:${contactDetails.email}">${contactDetails.email}</a></dd></div>
        <div><dt>${copy.phone}</dt><dd><a href="tel:+8615618143829">${contactDetails.phone}</a></dd></div>
        <div><dt>LinkedIn</dt><dd><a href="${contactDetails.linkedin}">${copy.linkedin}</a></dd></div>
        <div><dt>${copy.resume}</dt><dd><a href="${resumeUrl}">${copy.resumeLink}</a></dd></div>
      </dl>
      <div class="contact-social">
        <figure>
          <a class="contact-qr contact-qr-wechat" href="wechat-qr.jpg" aria-label="${copy.wechatQR}">
            <img src="wechat-qr.jpg" alt="" width="888" height="1131" loading="lazy">
          </a>
          <figcaption>${copy.wechat}</figcaption>
        </figure>
        <figure>
          <a class="contact-qr contact-qr-instagram" href="instagram-qr.jpg" aria-label="${copy.instagramQR}">
            <img src="instagram-qr.jpg" alt="" width="860" height="1470" loading="lazy">
          </a>
          <figcaption><a href="${contactDetails.instagram}">Instagram · @andrewxu_10</a></figcaption>
        </figure>
      </div>
    </div>`;
}

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const proxy = require('selenium-webdriver/proxy');
const fs = require('fs')

let dataArray = [];
let saveArray = [];
let newArray = []


async function XuLyDangNhap(proxyServer, proxyUsername, proxyPassword, your_email, your_password, _2fa, comment){
    LuuPhanTuData()
}

function LuuPhanTuData(){
    // Đọc nội dung của file data.txt
    fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Lỗi khi đọc file data.txt:', err);
      return;
    }
    
  
    // Đọc nội dung của file save.txt
    fs.readFile('save.txt', 'utf8', async (err, _saveData) => {
      if (err) {
        console.error('Lỗi khi đọc file save.txt:', err);
        return;
      }
      dataArray = data.split(',');
      saveArray = _saveData.split(',');
      newArray = []

    // Loại bỏ các phần tử trong saveArray khỏi dataArray
    saveArray.forEach(item => {
        const index = dataArray.indexOf(item);
        if (index !== -1) {
          dataArray.splice(index, 1);
        }
      });
      
      const newData = dataArray.join(',');

    // xu ly spam
    const proxyServer = 'https://139.180.154.18:49140';
    const proxyUsername = 'user49140';
    const proxyPassword = 'FOim4Y7T3X';
    const your_email = '61557153331786';
    const your_password = 'A123456789****';
    const _2fa = "M2P6SEJQCO7XXIXGGQHJDCKKOEDQGJTU";
    let comment = `🎉🎁 TẶNG 50k 🎁🎉 T&T Hotel and Apartment 26/369 Văn Cao
    🌟 Đừng bỏ lỡ cơ hội nhận ngay 50,000 VNĐ khi bạn đăng ký thông tin tại t & T Hotel AND APARTMENT! 🌟`

    // driver = XuLyDangNhap(proxyServer, proxyUsername, proxyPassword)

    const options = new chrome.Options().addArguments(`--proxy-server=${proxyServer}`);

    const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setProxy(proxy.manual({
            http: `${proxyUsername}:${proxyPassword}@${proxyServer}`,
            https: `${proxyUsername}:${proxyPassword}@${proxyServer}`,
            ftp: `${proxyUsername}:${proxyPassword}@${proxyServer}`
        }))
        .build();
    try {
        await driver.get('https://facebook.com');
        // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);

        // Điền thông tin email
        await driver.findElement(By.id('email')).sendKeys(your_email);
        // await driver.sleep(5000); // Dừng chương trình trong 10 giây
        // Điền thông tin mật khẩu
        await driver.findElement(By.id('pass')).sendKeys(your_password);
        // await driver.sleep(5000); // Dừng chương trình trong 10 giây
        // Nhấp vào nút đăng nhập
        await driver.findElement(By.name('login')).click();


        // await driver.sleep(100000); // Dừng chương trình trong 10 giây

        await driver.executeScript("window.open('https://www.2fa.live', '_blank');");
        // Đợi cho trang mới được mở
        await driver.sleep(2000); // Chờ 2 giây

        // Lấy danh sách các tab hiện tại
        const handles = await driver.getAllWindowHandles();
        // Chuyển tới tab mới mở
        await driver.switchTo().window(handles[1]);

        // Bây giờ bạn có thể thao tác trên tab mới ở đây
        
        // Điền thông tin 2fa
        await driver.findElement(By.id('listToken')).sendKeys(_2fa);

        // Nhấp vào nút submit
        await driver.findElement(By.id('submit')).click();

        // 
        await driver.sleep(2000); // Chờ 2 giây

        // Lấy văn bản từ textarea
        const textArea = await driver.findElement(By.id('output'));
        await driver.sleep(2000); // Chờ 2 giây
        const text = await textArea.getAttribute('value');
        // Sử dụng biểu thức chính quy để tìm số
        const match = text.match(/\|(\d+)/);
        let number = ''
        if (match) {
            number = match[1]; // Lấy số từ nhóm capture đầu tiên
            console.log("Số từ chuỗi:", number);
        } else {
            console.log("Không tìm thấy số trong chuỗi.");
        }

        // Chuyển lại tab gốc (tab Facebook)
        await driver.switchTo().window(handles[0]);


        // approvals_code
        await driver.findElement(By.id('approvals_code')).sendKeys(number);
        await driver.sleep(2000); // Dừng chương trình trong 2 giây
        // Nhấp vào nút đăng nhập
        await driver.findElement(By.id('checkpointSubmitButton')).click();
        await driver.sleep(2000); // Dừng chương trình trong 2 giây

        await driver.findElement(By.id('checkpointSubmitButton')).click();
        await driver.sleep(2000); // Dừng chương trình trong 2 giây
        

        for (let i=0;i<newData.split(',').length;i++){
           console.log(newData.split(',')[i])

           await driver.get(`https://www.facebook.com/profile.php?id=${ newData.split(',')[i] }`)



           saveArray.push(newData.split(',')[i])


           LuuFile('save.txt', saveArray.join(','))

        }


        await driver.sleep(100000000); // Dừng chương trình trong 10 giây

        

        fs.writeFile('data.txt', newData, (err) => {
            if (err) {
            console.error('Lỗi khi ghi file data.txt:', err);
            return;
            }
            console.log('Các phần tử đã được xóa thành công từ file data.txt!');
        });
        return newData

    } finally {
        await driver.quit();
    }
    //   

    });
  });

  
}

function DocFile(filePath){
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, _data) => {
        if (err) {
          console.error('Lỗi khi đọc file data.txt:', err);
          return;
        }
        console.log(_data)
        return _data
    })
}

function LuuFile(filePath,newData){
    fs.writeFile(filePath, newData, (err) => {
        if (err) {
          console.error('Lỗi khi ghi file data.txt:', err);
          return;
        }
        console.log(`Các phần tử đã được loại bỏ và lưu vào file ${ filePath } thành công!`);
      });
}


async function TiktokFollow(){
  console.log("ĐĂNG NHẬP TIKTOK MÀN HÌNH CRAWLER !!!")
  
  // xu ly spam
  const proxyServer = 'https://139.180.154.18:49140';
  const proxyUsername = 'user49140';
  const proxyPassword = 'FOim4Y7T3X';
  const your_email = '61557153331786';
  const your_password = 'A123456789****';
  const _2fa = "M2P6SEJQCO7XXIXGGQHJDCKKOEDQGJTU";
  let comment = `🎉🎁 TẶNG 50k 🎁🎉 T&T Hotel and Apartment 26/369 Văn Cao
  🌟 Đừng bỏ lỡ cơ hội nhận ngay 50,000 VNĐ khi bạn đăng ký thông tin tại t & T Hotel AND APARTMENT! 🌟`

  // driver = XuLyDangNhap(proxyServer, proxyUsername, proxyPassword)

  const options = new chrome.Options().addArguments(`--proxy-server=${proxyServer}`);

  const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setProxy(proxy.manual({
          http: `${proxyUsername}:${proxyPassword}@${proxyServer}`,
          https: `${proxyUsername}:${proxyPassword}@${proxyServer}`,
          ftp: `${proxyUsername}:${proxyPassword}@${proxyServer}`
      }))
      .build();
  try {
      await driver.get('https://tiktok.com');
      // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
      await driver.sleep(60000); // Chờ 60 giây
      // Điền thông tin email
      await driver.findElement(By.id('email')).sendKeys(your_email);
      // await driver.sleep(5000); // Dừng chương trình trong 10 giây
      // Điền thông tin mật khẩu
      await driver.findElement(By.id('pass')).sendKeys(your_password);
      // await driver.sleep(5000); // Dừng chương trình trong 10 giây
      // Nhấp vào nút đăng nhập
      await driver.findElement(By.name('login')).click();


      // await driver.sleep(100000); // Dừng chương trình trong 10 giây

      await driver.executeScript("window.open('https://www.2fa.live', '_blank');");
      // Đợi cho trang mới được mở
      await driver.sleep(2000); // Chờ 2 giây

      // Lấy danh sách các tab hiện tại
      const handles = await driver.getAllWindowHandles();
      // Chuyển tới tab mới mở
      await driver.switchTo().window(handles[1]);
  }
  catch(error){

  }

}

TiktokFollow()
// XuLyDangNhap()

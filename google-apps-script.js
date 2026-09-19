/**
 * NOLE STORE | Google Apps Script Database, Auto-Delivery & Backend API
 * 
 * FITUR LENGKAP:
 * 1. Setup Database Otomatis (Products + Orders)
 * 2. Mengambil stok secara real-time ke web
 * 3. Otomatis mengurangi stok saat checkout
 * 4. PENGIRIMAN OTOMATIS: Mengambil detail akses/akun dari Sheet,
 *    mengirim email otomatis ke pembeli via MailApp,
 *    dan menampilkan akses langsung di layar struk pesanan!
 */

// 1. SETUP OTOMATIS
function setupInitialDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const headers = [
    "id", "name", "category", "duration", "price", "stock", "description", "image", "featured", "access_info"
  ];
  
  const initialProducts = [
    [
      "higgsfield-pro",
      "Higgsfield Max",
      "video",
      "1 Month • 5,400 Credits",
      80,
      15,
      "AI video creation and creative tools with 5,400 monthly credits",
      "https://i.ibb.co.com/zhD7HyJQ/hgflds.png",
      false,
      "Login Portal: https://higgsfield.ai | Akun: hgfld-max@nolestore.com | Pass: HiggsNole#2026 | Catatan: Jangan ubah email utama."
    ],
    [
      "claude-max",
      "Claude Max 20x",
      "text-code",
      "1 Month",
      120,
      10,
      "Advanced AI assistance for demanding workflows",
      "https://i.ibb.co.com/h18VgjqT/Chat-GPT-Image-Sep-18-2026-07-39-51-PM.png",
      false,
      "Login Portal: https://claude.ai | Akun: claude-pro@nolestore.com | Pass: ClaudeNole#2026 | Catatan: Dedicated profile aktif."
    ],
    [
      "runway-pro",
      "Runway Pro",
      "video",
      "12 Month",
      168,
      8,
      "Professional AI video creation at only $14/month (regularly $28)",
      "https://i.ibb.co.com/hRV4LT0m/Chat-GPT-Image-Sep-18-2026-07-45-11-PM.png",
      false,
      "Login Portal: https://runwayml.com | Akun: runway-pro@nolestore.com | Pass: RunwayNole#2026"
    ],
    [
      "notion-ai-business",
      "Notion AI Business",
      "productivity",
      "12 Month",
      60,
      20,
      "AI-powered productivity for teams",
      "https://i.ibb.co.com/G4w4T8r0/Chat-GPT-Image-Sep-18-2026-07-47-11-PM.png",
      false,
      "Invite Code / Link: https://notion.so/invite/nolestore-workspace-biz | Akses Notion AI Aktif 12 Bulan"
    ],
    [
      "supergrok-heavy",
      "SuperGrok Heavy",
      "text-code",
      "1 Month",
      14,
      25,
      "Advanced AI access for everyday tasks",
      "https://i.ibb.co.com/RkPrZMjL/Chat-GPT-Image-Sep-18-2026-07-49-15-PM.png",
      false,
      "Login Portal: https://x.ai / https://twitter.com | Akun: grok-heavy@nolestore.com | Pass: GrokNole#2026"
    ],
    [
      "chatgpt-plus",
      "ChatGPT Pro 20x",
      "text-code",
      "6 Month • Full Warranty",
      35,
      12,
      "Premium AI access for work and creativity with full warranty",
      "https://i.ibb.co.com/ZRR2ng9S/Chat-GPT-Image-Sep-18-2026-07-42-20-PM.png",
      false,
      "Login Portal: https://chatgpt.com | Akun: gptpro-20x@nolestore.com | Pass: GptNole#2026 | Garansi 6 Bulan aktif."
    ],
    [
      "hbo-max",
      "HBO Max",
      "streaming",
      "12 Month",
      45,
      30,
      "Complete entertainment streaming access",
      "https://i.ibb.co.com/84j7qG9w/Chat-GPT-Image-Sep-18-2026-07-52-12-PM.png",
      false,
      "Login Portal: https://max.com | Akun: hbomax-premium@nolestore.com | Pass: MaxNole#2026 | Profile: Slot 1 (PIN: 1234)"
    ],
    [
      "google-one",
      "Google One Ultra AI",
      "productivity",
      "12 Month",
      85,
      15,
      "Cloud storage and AI capabilities for demanding projects",
      "https://i.ibb.co.com/mrgj7z85/Chat-GPT-Image-Sep-18-2026-07-54-47-PM.png",
      false,
      "Login Portal: https://gemini.google.com | Akun: google-ultra@nolestore.com | Pass: GeminiNole#2026"
    ]
  ];

  // Tab 1: Products
  let prodSheet = ss.getSheetByName("Products");
  if (!prodSheet) {
    prodSheet = ss.insertSheet("Products");
    prodSheet.appendRow(headers);
    initialProducts.forEach(row => prodSheet.appendRow(row));
    prodSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1D1D1F").setFontColor("#FFFFFF");
    prodSheet.autoResizeColumns(1, headers.length);
  } else {
    // JANGAN HAPUS STOK: Cek apakah kolom access_info (Kolom 10 / J) sudah ada
    const data = prodSheet.getDataRange().getValues();
    const currentHeaders = data[0] || [];
    let accessIndex = currentHeaders.findIndex(h => String(h).trim().toLowerCase() === "access_info");

    if (accessIndex === -1) {
      prodSheet.getRange(1, 10).setValue("access_info").setFontWeight("bold").setBackground("#1D1D1F").setFontColor("#FFFFFF");
      accessIndex = 9;
    }

    // Isi template akses jika masih kosong
    for (let r = 1; r < data.length; r++) {
      const prodId = String(data[r][0]).trim();
      const currentAccess = data[r][accessIndex];
      if (!currentAccess || String(currentAccess).trim() === "") {
        const found = initialProducts.find(p => p[0] === prodId);
        const def = found ? found[9] : "Portal: Login via official web | Hubungi admin untuk aktivasi.";
        prodSheet.getRange(r + 1, accessIndex + 1).setValue(def);
      }
    }
  }
  
  // Tab 2: Orders
  let orderSheet = ss.getSheetByName("Orders");
  if (!orderSheet) {
    orderSheet = ss.insertSheet("Orders");
    const orderHeaders = ["Timestamp", "Order ID", "Customer Email", "Contact Handle", "Ordered Items", "Total Amount", "Payment Method", "TxID Hash", "Status", "Delivered Access Details"];
    orderSheet.appendRow(orderHeaders);
    orderSheet.getRange(1, 1, 1, orderHeaders.length).setFontWeight("bold").setBackground("#0071E3").setFontColor("#FFFFFF");
    orderSheet.autoResizeColumns(1, orderHeaders.length);
  } else {
    const orderData = orderSheet.getDataRange().getValues();
    if (orderData.length > 0 && orderData[0].length < 10) {
      orderSheet.getRange(1, 10).setValue("Delivered Access Details").setFontWeight("bold").setBackground("#0071E3").setFontColor("#FFFFFF");
    }
  }
  
  Logger.log("SETUP BERHASIL! Database aman dan kolom access_info aktif.");
}

// 2. GET API: Mengambil data produk dan stok ATAU Cek Riwayat & Status Pesanan
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // JALUR 1: CEK RIWAYAT & STATUS PESANAN (Action: check_status)
    if (e && e.parameter && e.parameter.action === "check_status") {
      const query = String(e.parameter.query || "").trim().toLowerCase();
      if (!query) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Query parameter (Order ID or Email) is required."
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      let orderSheet = ss.getSheetByName("Orders");
      if (!orderSheet) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          count: 0,
          data: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const orderData = orderSheet.getDataRange().getValues();
      if (orderData.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          count: 0,
          data: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const matchingOrders = [];
      // Cari dari baris terbaru ke terlama
      for (let r = orderData.length - 1; r >= 1; r--) {
        const row = orderData[r];
        const orderId = String(row[1] || "").trim();
        const email = String(row[2] || "").trim();
        
        if (orderId.toLowerCase() === query || email.toLowerCase() === query) {
          const statusText = String(row[8] || "Pending Verification");
          const isCompleted = statusText.toLowerCase().includes("completed");
          
          matchingOrders.push({
            timestamp: row[0],
            orderId: orderId,
            email: email,
            items: row[4],
            total: row[5],
            paymentMethod: row[6],
            txid: row[7],
            status: statusText,
            // Jika status sudah Completed, kembalikan detail akses agar bisa langsung disalin
            accessDetails: isCompleted ? row[9] : null
          });
          
          if (matchingOrders.length >= 10) break;
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: matchingOrders.length,
        data: matchingOrders
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // JALUR 2: KATALOG PRODUK UMUM
    let sheet = ss.getSheetByName("Products");
    if (!sheet) {
      setupInitialDatabase();
      sheet = ss.getSheetByName("Products");
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const products = rows.map(row => {
      let item = {};
      headers.forEach((header, index) => {
        // Demi keamanan, access_info tidak dikirim saat browsing katalog umum
        if (header === "access_info") return;
        
        let val = row[index];
        if (header === "price" || header === "stock") val = Number(val) || 0;
        if (header === "featured") val = (val === true || String(val).toUpperCase() === "TRUE");
        item[header] = val;
      });
      return item;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: products.length,
      data: products
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 3. POST API: Mencatat pesanan, mengurangi stok, dan PENGIRIMAN AKSES OTOMATIS
function doPost(e) {
  try {
    const contents = e.postData.contents;
    const postData = JSON.parse(contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    let prodSheet = ss.getSheetByName("Products");
    if (!prodSheet) {
      setupInitialDatabase();
      prodSheet = ss.getSheetByName("Products");
    }
    const prodData = prodSheet.getDataRange().getValues();
    const headers = prodData[0] || [];
    let accessColIndex = headers.findIndex(h => String(h).trim().toLowerCase() === "access_info");
    if (accessColIndex === -1) {
      accessColIndex = 9;
      prodSheet.getRange(1, 10).setValue("access_info").setFontWeight("bold").setBackground("#1D1D1F").setFontColor("#FFFFFF");
    }
    
    const orderId = postData.orderId || ("NOLE-" + Math.floor(100000 + Math.random() * 900000));
    let deliveryDetails = [];
    
    // 1. Kurangi stok dan ambil access_info dari sheet
    if (postData.items && Array.isArray(postData.items)) {
      postData.items.forEach(orderItem => {
        for (let i = 1; i < prodData.length; i++) {
          if (String(prodData[i][0]).trim() === String(orderItem.id).trim()) {
            // Kurangi stok
            const currentStock = Number(prodData[i][5]) || 0;
            const deductQty = Number(orderItem.quantity) || 1;
            const updatedStock = Math.max(0, currentStock - deductQty);
            prodSheet.getRange(i + 1, 6).setValue(updatedStock);
            
            // Ambil access_info langsung dari sel kolom yang ditentukan di Google Sheets
            let accessInfo = prodData[i][accessColIndex];
            if (!accessInfo || String(accessInfo).trim() === "") {
              accessInfo = "Detail akses akun resmi untuk " + (postData.email || "akun Anda") + " telah disiapkan. Hubungi admin untuk bantuan aktivasi.";
            }

            deliveryDetails.push({
              id: orderItem.id,
              name: orderItem.name || prodData[i][1],
              duration: orderItem.duration || prodData[i][3],
              quantity: orderItem.quantity,
              access: String(accessInfo).trim()
            });
            break;
          }
        }
      });
    }
    
    // 2. Format ringkasan akses untuk dicatat di Orders
    const accessSummary = deliveryDetails.map(d => `[${d.name}]: ${d.access}`).join("\n\n");
    const itemsSummary = (postData.items || []).map(i => `${i.name} (x${i.quantity})`).join(", ");
    
    // 3. Catat ke tab Orders dengan status Pending Verification
    let orderSheet = ss.getSheetByName("Orders");
    if (!orderSheet) {
      orderSheet = ss.insertSheet("Orders");
      orderSheet.appendRow(["Timestamp", "Order ID", "Customer Email", "Contact Handle", "Ordered Items", "Total Amount", "Payment Method", "TxID Hash", "Status", "Delivered Access Details"]);
    }
    
    orderSheet.appendRow([
      new Date(),
      orderId,
      postData.email || "-",
      postData.handle || "-",
      itemsSummary,
      "$" + (postData.total || 0),
      postData.paymentMethod || "Crypto",
      postData.txid || "Pending Confirmation",
      "Pending Verification",
      accessSummary
    ]);
    
    // Highlight pending row in soft amber
    const lastRow = orderSheet.getLastRow();
    orderSheet.getRange(lastRow, 9).setBackground("#FFF3CD").setFontColor("#856404").setFontWeight("bold");

    // 4. SEND ORDER RECEIVED CONFIRMATION EMAIL (Pending Verification)
    if (postData.email && postData.email.includes("@")) {
      try {
        const emailSubject = `[NOLE STORE] Order #${orderId} Received (Pending Payment Verification)`;
        const emailHtmlBody = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1d1d1f; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #1d1d1f;">NOLE STORE</h1>
              <p style="font-size: 13px; color: #6e6e73; margin-top: 4px;">Premium Digital Products</p>
            </div>
            
            <div style="background: #fff8e1; border: 1px solid #ffe082; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; text-align: center;">
              <h2 style="font-size: 18px; color: #b78103; margin: 0 0 6px 0;">Your Order Has Been Received! ⏳</h2>
              <p style="font-size: 13px; color: #795548; margin: 0;">Order ID: <strong>#${orderId}</strong> • Total: <strong>$${postData.total}</strong></p>
            </div>

            <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
              Hello, thank you for shopping at NOLE STORE. Your transfer transaction is currently being verified on the blockchain.
            </p>

            <div style="background-color: #f7f7f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #e5e5e7; font-size: 13px;">
              <strong>Order Details:</strong><br>
              ${itemsSummary}<br><br>
              <strong>Payment Method:</strong> ${postData.paymentMethod || 'Crypto'}<br>
              <strong>TxID:</strong> <span style="font-family: monospace;">${postData.txid || '-'}</span>
            </div>

            <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 12px; padding: 14px; font-size: 13px; color: #0d47a1; margin-top: 20px; line-height: 1.5;">
              <strong>When will your credentials be delivered?</strong><br>
              As soon as your transfer is verified by our admin (estimated 5 to 15 minutes), your official credentials and access details will be automatically delivered to this email address.
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #f0f0f2; font-size: 11px; color: #86868b;">
              &copy; 2026 NOLE STORE. All rights reserved.
            </div>
          </div>
        `;

        MailApp.sendEmail({
          to: postData.email,
          subject: emailSubject,
          htmlBody: emailHtmlBody,
          name: "NOLE STORE"
        });
      } catch (errEmail) {
        Logger.log("Email order notification error: " + errEmail);
      }
    }
    
    // 5. Secure response to browser (without leaking password before payment is verified)
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      orderId: orderId,
      email: postData.email,
      total: postData.total,
      orderStatus: "Pending Verification",
      message: "Order successfully recorded and pending transfer verification."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 4. ADMIN MENU IN GOOGLE SHEETS (1-Click Access Delivery)
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 NOLE STORE ADMIN')
    .addItem('✅ Approve & Deliver Access (Selected Row)', 'sendAccessForSelectedOrder')
    .addSeparator()
    .addItem('🔄 Check & Sync Database', 'setupInitialDatabase')
    .addToUi();
}

/**
 * 1-Click Admin Function:
 * When admin selects an order row in the Orders tab and clicks this menu:
 * - Email with official credentials is sent directly to customer.
 * - Status is updated to 'Completed (Delivered)' (green).
 */
function sendAccessForSelectedOrder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  if (sheet.getName() !== "Orders") {
    SpreadsheetApp.getUi().alert("Notice", "Please open the 'Orders' tab first and select the order row you wish to approve.", SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  const row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Warning", "Please select a customer order row (not the header row).", SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  const rowData = sheet.getRange(row, 1, 1, 10).getValues()[0];
  const orderId = rowData[1];
  const email = rowData[2];
  const items = rowData[4];
  const total = rowData[5];
  const accessDetails = rowData[9];
  
  if (!email || !String(email).includes("@")) {
    SpreadsheetApp.getUi().alert("Failed", "Customer email on this row is invalid: " + email, SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  if (!accessDetails || String(accessDetails).trim() === "") {
    SpreadsheetApp.getUi().alert("Failed", "The 'Delivered Access Details' column is empty for this order.", SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  // Send official credentials email to customer
  const emailSubject = `[NOLE STORE] Your Digital Product Access (Order #${orderId})`;
  const emailHtmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1d1d1f; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #1d1d1f;">NOLE STORE</h1>
        <p style="font-size: 13px; color: #6e6e73; margin-top: 4px;">Payment Verified • Official Digital Product Credentials</p>
      </div>
      
      <div style="background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; text-align: center;">
        <h2 style="font-size: 18px; color: #2e7d32; margin: 0 0 6px 0;">Payment Successfully Verified! 🎉</h2>
        <p style="font-size: 13px; color: #388e3c; margin: 0;">Order ID: <strong>#${orderId}</strong> • Total: <strong>${total}</strong></p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
        Hello, your payment has been received and verified. Below are your official product credentials and access details:
      </p>

      <div style="background-color: #f7f7f9; border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid #e5e5e7;">
        <div style="font-weight: 700; font-size: 14px; color: #1d1d1f; margin-bottom: 8px;">Items: ${items}</div>
        <div style="font-size: 13px; color: #1d1d1f; font-family: monospace; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #e0e0e3; white-space: pre-wrap; line-height: 1.5;">${accessDetails}</div>
      </div>

      <div style="background: #fff8e1; border: 1px solid #ffe082; border-radius: 12px; padding: 14px; font-size: 12px; color: #795548; margin-top: 24px;">
        <strong>Important:</strong> Keep these credentials safe. If you need any assistance or have warranty questions, please contact our support team.
      </div>

      <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #f0f0f2; font-size: 11px; color: #86868b;">
        &copy; 2026 NOLE STORE. All rights reserved.
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: emailSubject,
    htmlBody: emailHtmlBody,
    name: "NOLE STORE"
  });
  
  // Update order status to Completed (Delivered)
  sheet.getRange(row, 9).setValue("Completed (Delivered)").setBackground("#d4edda").setFontColor("#155724").setFontWeight("bold");
  
  SpreadsheetApp.getUi().alert("Success! ✅", `Credentials for order #${orderId} have been sent to: ${email}\nOrder status has been updated to 'Completed (Delivered)'.`, SpreadsheetApp.getUi().ButtonSet.OK);
}

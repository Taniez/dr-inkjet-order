import { useState, useEffect } from "react";
import html2canvas from "html2canvas";

export default function Admin() {

  // =========================
  // AUTO LOGIN (ไม่ต้อง Login)
  // =========================

  const [loggedIn, setLoggedIn] = useState(true);

  // =========================
  // DATA
  // =========================

  const [history, setHistory] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  // =========================
  // POPUP
  // =========================

  const [editOpen, setEditOpen] =
    useState(false);

  const [editRow, setEditRow] =
    useState(null);

  // =========================
  // FORM STATES
  // =========================

  const [customer, setCustomer] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [taxId, setTaxId] =
    useState("");

  const [note, setNote] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [payment, setPayment] =
    useState("โอน");

  const [items, setItems] =
    useState([
      {
        name: "",
        size: "",
        qty: "",
        price: "",
        suggestions: [],
      },
    ]);

  // =========================
  // LOAD DATA ON MOUNT
  // =========================

  useEffect(() => {
    fetchHistory();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // SEARCH FILTER & SORT
  // =========================

  const filteredHistory =
  [...history]
    .filter((item) => {

      // ถ้า search ว่างให้แสดงทั้งหมด
      if (!search.trim()) return true;

      const keyword = search.toLowerCase().trim();

      // Normalize ข้อมูลต่างๆ เพื่อค้นหาที่ดีกว่า
      const customer = (item.customer || "").toLowerCase().trim();
      const name = (item.name || "").toLowerCase().trim();
      const phone = (item.phone || "").toString().trim();
      const note = (item.note || "").toLowerCase().trim();
      const address = (item.address || "").toLowerCase().trim();

      return (
        customer.includes(keyword)
        || name.includes(keyword)
        || phone.includes(keyword)
        || note.includes(keyword)
        || address.includes(keyword)
      );

    })
    .sort((a, b) => {
      // Sort โดยดูจากวันที่ให้ล่าสุดขึ้นมาก่อน
      try {
        // Parse date ให้ถูกต้อง
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA; // ล่าสุดขึ้นมาก่อน
      } catch (e) {
        return 0;
      }
    });

  // =========================
  // FETCH DATA
  // =========================

  const fetchHistory = () => {

    setLoading(true);
    setError(null);

    // Set timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("ไม่สามารถโหลดข้อมูลได้ (หมดเวลา) โปรดลองใหม่อีกครั้ง");
      console.error("Fetch timeout after 10 seconds");
    }, 10000);

    const oldScript =
      document.getElementById(
        "sheetScript"
      );

    if (oldScript) {
      oldScript.remove();
    }

    delete window.loadData;

    window.loadData = (data) => {
      
      clearTimeout(timeoutId);
      setLoading(false);

      try {
        console.log("✅ ข้อมูลจาก Sheet:", data);
        console.log("📊 จำนวนรายการ:", Array.isArray(data) ? data.length : 0);

        if (!data || (Array.isArray(data) && data.length === 0)) {
          setError(null);
          setHistory([]);
        } else if (Array.isArray(data)) {
          setHistory(data);
          setError(null);
        } else {
          console.error("Format ข้อมูลไม่ถูกต้อง:", data);
          setError("Format ข้อมูลไม่ถูกต้อง");
          setHistory([]);
        }
      } catch (err) {
        console.error("Error processing data:", err);
        setError("เกิดข้อผิดพลาดในการประมวลผลข้อมูล");
        setHistory([]);
      }
    };

    // Error handler
    window.loadDataError = (error) => {
      clearTimeout(timeoutId);
      setLoading(false);
      console.error("API Error:", error);
      setError("ไม่สามารถเชื่อมต่อกับ Sheet ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
      setHistory([]);
    };

    try {
      const script =
        document.createElement("script");

      script.id = "sheetScript";

      script.src =
        `https://script.google.com/macros/s/AKfycbyGMIrc0FimIScCMVuxOoaBIpIpY0Lc0LD6m1IOxmPdL3_3NkTqLMqlS2sJFAQ6REUw/exec?callback=loadData&t=${Date.now()}`;

      script.onerror = () => {
        clearTimeout(timeoutId);
        setLoading(false);
        setError("ไม่สามารถโหลดสคริปต์ได้ โปรดลองใหม่อีกครั้ง");
        console.error("Script loading error");
      };

      document.body.appendChild(script);

    } catch (err) {
      clearTimeout(timeoutId);
      setLoading(false);
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด");
      console.error("Exception:", err);
    }
  };

  // =========================
  // UPDATE
  // =========================

  const updateData = async () => {

    const item = items[0];

    await fetch(
      "https://script.google.com/macros/s/AKfycbyGMIrc0FimIScCMVuxOoaBIpIpY0Lc0LD6m1IOxmPdL3_3NkTqLMqlS2sJFAQ6REUw/exec",
      {

        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
        },

        body: JSON.stringify({

          action: "update",

          row: editRow,

          date:
            new Date()
              .toLocaleDateString(),

          name: item.name,

          size: item.size,

          qty: item.qty,

          price: item.price,

          payment,

          customer,

          phone,

          tax: taxId,

          note,

          address,

        }),

      }
    );

    alert("แก้ไขสำเร็จ");

    setEditOpen(false);

    fetchHistory();
  };

  // =========================
  // DELETE
  // =========================

  const deleteData =
  async (row) => {

    const confirmDelete =
      confirm("ลบรายการนี้?");

    if (!confirmDelete)
      return;

    await fetch(
      "https://script.google.com/macros/s/AKfycbyGMIrc0FimIScCMVuxOoaBIpIpY0Lc0LD6m1IOxmPdL3_3NkTqLMqlS2sJFAQ6REUw/exec",
      {

        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
        },

        body: JSON.stringify({

          action: "delete",

          row,

        }),

      }
    );

    alert("ลบสำเร็จ");

    fetchHistory();
  };

  // =========================
  // SAVE INVOICE IMAGE
  // =========================

  const saveInvoiceImage = (item) => {

    if (
      item.payment !== "โอน" &&
      item.payment !== "เงินสด"
    ) {

      alert("รายการนี้ไม่ใช่ โอน หรือ เงินสด");

      return;
    }

    const total =
      Number(item.qty || 0) *
      Number(item.price || 0);

    const html = `
      <html>
      <head>

        <title>Invoice</title>

        <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

        <style>

          body{
            margin:0;
            background:#e5e5e5;
            font-family:sans-serif;
          }

          #invoice{
            width:1400px;
            min-height:2000px;
            background:white;
            margin:auto;
            padding:40px;
            box-sizing:border-box;
          }

          .top{
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
          }

          .logo{
            width:280px;
          }

          .title{
            font-size:72px;
            font-weight:900;
            text-align:right;
            line-height:1.1;
          }

          .date{
            font-size:42px;
            margin-top:20px;
            text-align:right;
          }

          .company{
            font-size:30px;
            line-height:1.8;
          }

          .customer{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:40px;
            margin-top:120px;
            font-size:42px;
          }

          .line{

            border-bottom:2px solid #ccc;
            padding-bottom:10px;
          }

.tax{
margin-top:30px;
          gap:40px;
  
            font-size:42px;
  border-bottom:2px solid #ccc;
}

          .table{
            margin-top:60px;
            border:3px solid black;
            border-radius:40px;
            overflow:hidden;
          }

          .thead{
            display:grid;
            grid-template-columns:5fr 2fr 2fr 2fr 1fr;
            background:#2b2b2b;
            color:white;
            font-size:28px;
            font-weight:bold;
          }

          .thead div{
            padding:25px;
            border-right:1px solid white;
          }

          .row{
            display:grid;
            grid-template-columns:5fr 2fr 2fr 2fr 1fr;
            min-height:100px;
            font-size:28px;
            border-top:2px solid black;
          }

          .row div{
            padding:25px;
            border-right:2px solid black;
          }

          .footer{
            display:flex;
            justify-content:space-between;
            margin-top:80px;
            gap:40px;
          }

          .note{
            width:55%;
          }

          .right{
            width:45%;
          }

          .total{
            border:3px solid black;
            border-radius:999px;
            padding:20px 40px;
            font-size:40px;
            font-weight:bold;
            display:flex;
            justify-content:space-between;
          }

          .qr{
            margin-top:40px;
            text-align:center;
          }

          .qr img{
            width:520px;
          }

        </style>

      </head>

      <body>

        <div id="invoice">

          <div class="top">

            <img
              class="logo"
              src="/img/5.png"
            />

            <div class="company">

              ดีอาร์ อิงค์เจ็ท ปริ้นซ์
              <br/>

              96 ตลาดสุขใจ ตำบลคลองหนึ่ง
              <br/>

              อำเภอคลองหลวง จังหวัดปทุมธานี
              <br/>

              โทร. 063 846 2546 และ 065 569 9961
              <br/>

              email: dr.inkjet.print@gmail.com

            </div>

            <div>

              <div class="title">
                ใบเสร็จรับเงิน
              </div>

              <div class="date">
                วันที่ ${new Date(item.date).toLocaleDateString("th-TH")}
              </div>

            </div>

          </div>

          <div class="customer">

            <div class="line">
              ชื่อลูกค้า: ${item.customer || ""}
            </div>

            <div class="line">
              เบอร์ติดต่อ: ${item.phone || ""}
            </div>

          </div>

          <div class="tax">
            เลขประจำตัวผู้เสียภาษี:${item.tax || ""}
          </div>

          <div class="tax">
            ที่อยู่:${item.address || ""}
          </div>

          <div class="table">

            <div class="thead">

              <div>รายละเอียดสินค้า</div>

              <div>ขนาด</div>

              <div>จำนวน</div>

              <div>ราคา/หน่วย</div>

              <div>รวม</div>

            </div>

            <div class="row">

              <div>${item.name || ""}</div>

              <div>${item.size || ""}</div>

              <div>${item.qty || ""}</div>

              <div>${item.price || ""}</div>

              <div>${total}</div>

            </div>

          </div>

          <div class="footer">

            <div class="note">

              <div style="font-size:42px;font-weight:bold;">
                *หมายเหตุ
              </div>

              <div style="font-size:30px;margin-top:20px;color:red;">
                ${item.note || ""}
              </div>

            </div>

            <div class="right">

              <div class="total">

                <span>
                  รวมทั้งสิ้น:
                </span>

                <span>
                  ${total}
                </span>

              </div>

              <div class="qr">

                <img src="/img/line.png"/>

              </div>

            </div>

          </div>

        </div>

        <script>

          window.onload = async () => {

            const canvas =
              await html2canvas(
                document.getElementById("invoice"),
                {
                  scale:2,
                  useCORS:true,
                  backgroundColor:"#ffffff"
                }
              );

            const image =
              canvas.toDataURL("image/png");

            const link =
              document.createElement("a");

            link.href = image;

            link.download =
              "invoice-${item.row}.png";

            link.click();
          };

        </script>

      </body>
      </html>
    `;

    const win =
      window.open("", "_blank");

    win.document.write(html);

    win.document.close();
  };

  // =========================
  // MAIN ADMIN PAGE
  // =========================

  return (

    <div className="min-h-screen bg-gray-100 p-3 md:p-5">

<div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">

        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-6">

          <div>
            <div className="text-2xl md:text-3xl font-bold">
              ประวัติรายการทั้งหมด (ใบเสร็จ)
            </div>
            {history.length > 0 && !loading && (
              <div className="text-sm text-gray-500 mt-1">
                รวม {history.length} รายการ
              </div>
            )}
          </div>

          <button
            onClick={fetchHistory}
            className="bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "⏳ กำลังโหลด..." : "🔄 รีโหลด"}
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin">⏳</div>
              <span className="text-blue-700 font-semibold">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span className="text-red-700 font-semibold">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">

          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อลูกค้า / รายการ / เบอร์โทร"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={loading}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            )}
          </div>

          {search && (
            <div className="mt-2 text-sm text-gray-600">
              พบ <span className="font-bold text-blue-600">{filteredHistory.length}</span> รายการ
            </div>
          )}

        </div>

        {/* EMPTY STATE */}
        {!loading && history.length === 0 && !error && (
          <div className="p-10 bg-gray-50 rounded-2xl text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-600 font-semibold">ยังไม่มีข้อมูล</p>
            <p className="text-gray-500 text-sm mt-1">โปรดรอสักครู่หรือลองกดปุ่มรีโหลด</p>
          </div>
        )}

        {/* DESKTOP TABLE VIEW */}
        {history.length > 0 && (
        <div className="hidden md:block overflow-auto rounded-2xl border" style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>

        <table className="w-full text-xs md:text-sm min-w-[1000px]">

            <thead className="bg-black text-white">

              <tr>

                <th className="p-3 text-left">วันที่</th>
                <th className="p-3 text-left">รายการ</th>
                <th className="p-3 text-left">ขนาด</th>
                <th className="p-3 text-center">จำนวน</th>
                <th className="p-3 text-center">ราคา</th>
                <th className="p-3 text-center">รวม</th>
                <th className="p-3 text-left">การชำระเงิน</th>
                <th className="p-3 text-left">ลูกค้า</th>
                <th className="p-3 text-left">เบอร์โทร</th>
                <th className="p-3 text-left">เลขผู้เสียภาษี</th>
                <th className="p-3 text-left">หมายเหตุ</th>
                <th className="p-3 text-left">ที่อยู่</th>
                <th className="p-3 text-left">จัดการ</th>

              </tr>

            </thead>

            <tbody>

              {filteredHistory.length > 0 ? (

                filteredHistory.map((item, index) => (

                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {
                        item.date
                          ? new Date(item.date)
                              .toLocaleDateString("th-TH")
                          : ""
                      }
                    </td>

                    <td className="p-3">
                      {item.name}
                    </td>

                    <td className="p-3">
                      {item.size}
                    </td>

                    <td className="p-3 text-center">
                      {item.qty}
                    </td>

                    <td className="p-3 text-center">
                      {item.price}
                    </td>

                    <td className="p-3 text-center font-bold">
                      {item.total}
                    </td>

                    <td className="p-3">
                      {item.payment}
                    </td>

                    <td className="p-3">
                      {item.customer}
                    </td>

                    <td className="p-3">
                      {item.phone}
                    </td>

                    <td className="p-3">
                      {item.tax}
                    </td>

                    <td className="p-3 whitespace-pre-wrap max-w-[150px]">
                      {item.note}
                    </td>

                    <td className="p-3 whitespace-pre-wrap max-w-[150px]">
                      {item.address}
                    </td>

                    <td className="flex flex-col gap-2 p-3">

                      <button

                        onClick={() =>
                          saveInvoiceImage(item)
                        }

                        className="
                          bg-green-500
                          hover:bg-green-600
                          text-white
                          px-3
                          py-1
                          rounded-lg
                          text-sm
                        "

                      >
                        💾 Save
                      </button>

                      <button

                        onClick={() => {

                          setEditRow(
                            item.row
                          );

                          setCustomer(
                            item.customer || ""
                          );

                          setPhone(
                            item.phone || ""
                          );

                          setTaxId(
                            item.tax || ""
                          );

                          setNote(
                            item.note || ""
                          );

                          setAddress(
                            item.address || ""
                          );

                          setPayment(
                            item.payment || "โอน"
                          );

                          setItems([
                            {
                              name:
                                item.name || "",

                              size:
                                item.size || "",

                              qty:
                                item.qty || "",

                              price:
                                item.price || "",

                              suggestions: [],
                            },
                          ]);

                          setEditOpen(true);

                        }}

                        className="
                          bg-yellow-400
                          hover:bg-yellow-500
                          text-black
                          px-3
                          py-1
                          rounded-lg
                          text-sm
                        "

                      >
                        ✏️ แก้ไข
                      </button>

                      <button

                        onClick={() =>
                          deleteData(
                            item.row
                          )
                        }

                        className="
                          bg-red-500
                          hover:bg-red-600
                          text-white
                          px-3
                          py-1
                          rounded-lg
                          text-sm
                        "

                      >
                        🗑️ ลบ
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="13"
                    className="text-center p-10 text-gray-500"
                  >
                    ไม่มีข้อมูล
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>
        )}

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow border-l-4 border-blue-500"
              >
                <div className="font-bold text-lg mb-2">
                  {item.customer}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div><span className="font-semibold">วันที่:</span> {item.date ? new Date(item.date).toLocaleDateString("th-TH") : ""}</div>
                  <div><span className="font-semibold">รายการ:</span> {item.name}</div>
                  <div><span className="font-semibold">ขนาด:</span> {item.size}</div>
                  <div><span className="font-semibold">จำนวน:</span> {item.qty}</div>
                  <div><span className="font-semibold">ราคา:</span> ฿{item.price}</div>
                  <div className="font-bold text-green-600"><span className="font-semibold">รวม:</span> ฿{item.total}</div>
                  <div><span className="font-semibold">เบอร์:</span> {item.phone}</div>
                  <div><span className="font-semibold">ชำระ:</span> {item.payment}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      saveInvoiceImage(item)
                    }
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-lg text-sm"
                  >
                    💾 Save
                  </button>

                  <button
                    onClick={() => {
                      setEditRow(item.row);
                      setCustomer(item.customer || "");
                      setPhone(item.phone || "");
                      setTaxId(item.tax || "");
                      setNote(item.note || "");
                      setAddress(item.address || "");
                      setPayment(item.payment || "โอน");
                      setItems([
                        {
                          name: item.name || "",
                          size: item.size || "",
                          qty: item.qty || "",
                          price: item.price || "",
                          suggestions: [],
                        },
                      ]);
                      setEditOpen(true);
                    }}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-2 rounded-lg text-sm"
                  >
                    ✏️ แก้ไข
                  </button>

                  <button
                    onClick={() =>
                      deleteData(item.row)
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-lg text-sm"
                  >
                    🗑️ ลบ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 text-gray-500">
              ไม่มีข้อมูล
            </div>
          )}
        </div>

      </div>

      {/* EDIT MODAL */}
      {editOpen && (

        <div className="
          fixed
          inset-0
          bg-black/50
          z-50
          flex
          items-center
          justify-center
          p-5
        ">

<div className="
  bg-white
  rounded-3xl
  w-full
  max-w-2xl
  p-4 md:p-6
  max-h-[90vh]
  overflow-y-auto
">

            <div className="
              flex
              justify-between
              items-center
              mb-6
            ">

              <div className="
                text-2xl
                font-bold
              ">
                แก้ไขข้อมูล
              </div>

              <button
                onClick={() =>
                  setEditOpen(false)
                }
                className="text-3xl cursor-pointer hover:text-red-500"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="ชื่อลูกค้า"
                value={customer}
                onChange={(e) =>
                  setCustomer(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="text"
                placeholder="เบอร์โทร"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="text"
                placeholder="เลขผู้เสียภาษี"
                value={taxId}
                onChange={(e) =>
                  setTaxId(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <textarea
                placeholder="ที่อยู่"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                  min-h-[100px]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <textarea
                placeholder="หมายเหตุ"
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                  min-h-[120px]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <select
                value={payment}
                onChange={(e) =>
                  setPayment(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-4
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="โอน">
                  โอน
                </option>

                <option value="เงินสด">
                  เงินสด
                </option>

                <option value="ค้างจ่าย">
                  ค้างจ่าย
                </option>

              </select>

            </div>

            <div className="mt-6">

              {items.map((item, index) => (

                <div
                  key={index}
                  className="
                    border
                    rounded-2xl
                    p-4
                    bg-gray-50
                  "
                >

                  <input
                    type="text"
                    placeholder="รายการ"
                    value={item.name}
                    onChange={(e) => {

                      const newItems =
                        [...items];

                      newItems[index].name =
                        e.target.value;

                      setItems(newItems);

                    }}
                    className="
                      w-full
                      border
                      p-3
                      rounded-xl
                      mb-3
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-3
                  ">

                    <input
                      type="text"
                      placeholder="ขนาด"
                      value={item.size}
                      onChange={(e) => {

                        const newItems =
                          [...items];

                        newItems[index].size =
                          e.target.value;

                        setItems(newItems);

                      }}
                      className="
                        border
                        p-3
                        rounded-xl
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                    <input
                      type="number"
                      placeholder="จำนวน"
                      value={item.qty}
                      onChange={(e) => {

                        const newItems =
                          [...items];

                        newItems[index].qty =
                          e.target.value;

                        setItems(newItems);

                      }}
                      className="
                        border
                        p-3
                        rounded-xl
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                    <input
                      type="number"
                      placeholder="ราคา"
                      value={item.price}
                      onChange={(e) => {

                        const newItems =
                          [...items];

                        newItems[index].price =
                          e.target.value;

                        setItems(newItems);

                      }}
                      className="
                        border
                        p-3
                        rounded-xl
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                  </div>

                </div>

              ))}

            </div>

            <div className="
              flex
              gap-3
              mt-6
            ">

              <button
                onClick={() =>
                  setEditOpen(false)
                }
                className="
                  flex-1
                  border
                  p-4
                  rounded-xl
                  hover:bg-gray-100
                "
              >
                ปิด
              </button>

              <button
                onClick={updateData}
                className="
                  flex-1
                  bg-green-500
                  text-white
                  p-4
                  rounded-xl
                  hover:bg-green-600
                "
              >
                💾 บันทึก
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
    

  );
}
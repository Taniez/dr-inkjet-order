import { useState } from "react";
import html2canvas from "html2canvas";

export default function App() {

  // =========================
  // PRODUCT SUGGESTIONS
  // =========================

  const productSuggestions = [
    "ไวนิล",
    "ไวนิล+โครงไม้",
    "ไวนิล+เจาะตาไก่",
    "สติ๊กเกอร์",
    "สติ๊กเกอร์กันน้ำ",
    "นามบัตร",
    "ใบปลิว",
    "โบรชัวร์",
    "ป้ายไวนิลขึงไม้",
    "ฉลากสินค้า",
    "เมนูอาหาร",
    "โปสเตอร์",
    "อิงค์เจ็ท",
    "แคนวาส",
    "สแกน",
    "เคลือบบัตร",
    "สติ๊กเกอร์ไดคัท",
    "ไดคัท",
    "ตรายาง",
    "เจาะตาไก่",
    "เสื้อ DFT",
    "พิม 4 สี",
    "แผ่นอคลิลิกใส 5มิล",
    "แผ่นอคลิลิกใส 3มิล",
    "เคลือบใส",
    "เคลือบด้าน",
    "ออกแบบ",
    "จัดส่ง",
    "พิมพ์ A4 4สี +เคลือบ",
    "A4 +เคลือบ หน้าหลัง",
    "สติกเกอร์บนฟิวเจอร์บอร์ด",
    "ป้ายธงญี่ปุ่น",
    "พิมขาวดำ"
  ];

  // =========================
  // STATES
  // =========================

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [taxId, setTaxId] = useState("");
  const [note, setNote] = useState("");

  const [items, setItems] = useState([
    {
      name: "",
      size: "",
      qty: 1,
      price: 0,
      suggestions: [],
    },
  ]);

  // =========================
  // ADD ITEM
  // =========================

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        size: "",
        qty: 1,
        price: 0,
        suggestions: [],
      },
    ]);
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = (index) => {

    const newItems = [...items];

    newItems.splice(index, 1);

    setItems(newItems);
  };

  // =========================
  // UPDATE ITEM
  // =========================

  const updateItem = (
    index,
    field,
    value
  ) => {

    const newItems = [...items];

    newItems[index][field] = value;

    // SEARCH SUGGESTION
    if (field === "name") {

      if (value.trim() !== "") {

        const matches = productSuggestions
          .filter((item) =>
            item
              .toLowerCase()
              .includes(value.toLowerCase())
          )
          .slice(0, 3);

        newItems[index].suggestions =
          matches;

      } else {

        newItems[index].suggestions = [];
      }
    }

    setItems(newItems);
  };

  // =========================
  // SELECT SUGGESTION
  // =========================

  const selectSuggestion = (
    index,
    text
  ) => {

    const newItems = [...items];

    newItems[index].name = text;

    newItems[index].suggestions = [];

    setItems(newItems);
  };

  // =========================
  // TOTAL
  // =========================

  const total = items.reduce(
    (sum, item) =>
      sum + item.qty * item.price,
    0
  );

  // =========================
  // PRINT
  // =========================

  const printPage = () => {
    window.print();
  };

  // =========================
  // SAVE IMAGE
  // =========================

  const saveImage = async () => {

    const element =
      document.getElementById("invoice");

    const canvas =
      await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

    const image =
      canvas.toDataURL("image/png");

    const link =
      document.createElement("a");

    link.href = image;

    link.download =
      `invoice-${Date.now()}.png`;

    link.click();
  };

  // =========================
  // EMPTY ROWS
  // =========================

  const emptyRows =
    1 - items.length;

  return (

    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">

        <div>

          <h1 className="text-3xl font-bold">
            DR INKJET PRINT
          </h1>

          <p className="opacity-80">
            ระบบใบสั่งซื้อสินค้า
          </p>

        </div>

        <div className="flex gap-3">

          <button
            className="bg-white/20 px-4 py-2 rounded-xl"
            onClick={saveImage}
          >
            Save PNG
          </button>

          <button
            className="bg-white/20 px-4 py-2 rounded-xl"
            onClick={printPage}
          >
            พิมพ์
          </button>

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-6 grid lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h2 className="text-2xl font-bold mb-6 text-purple-700">
            สร้างใบสั่งซื้อสินค้า
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="ชื่อลูกค้า"
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="เบอร์โทร"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="text"
              placeholder="เลขผู้เสียภาษี"
              value={taxId}
              onChange={(e) =>
                setTaxId(e.target.value)
              }
              className="w-full border p-4 rounded-xl"
            />
              <input
              type="text"
              placeholder="หมายเหตุ"
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
              className="w-full border p-4 rounded-xl"
            />

          </div>

          {/* INPUT TABLE */}

          <div className="mt-8">

            <div className="grid grid-cols-12 gap-3 bg-gradient-to-r from-purple-700 to-blue-600 text-white p-4 rounded-t-2xl text-center font-semibold">

              <div className="col-span-4">
                รายการ
              </div>

              <div className="col-span-2">
                ขนาด
              </div>

              <div className="col-span-2">
                จำนวน
              </div>

              <div className="col-span-2">
                ราคา
              </div>

              <div className="col-span-2">
                รวม
              </div>

            </div>

            <div className="border border-t-0 rounded-b-2xl p-4 space-y-3">

              {items.map((item, index) => (

                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 relative"
                >

                  {/* NAME */}

                  <div className="col-span-4 relative">

                    <input
                      className="border p-3 rounded-xl w-full"
                      placeholder="รายละเอียด"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />

                    {/* SUGGESTION */}

                    {item.suggestions.length > 0 && (

                      <div className="absolute z-50 bg-white border rounded-xl shadow-xl mt-1 w-full overflow-hidden">

                        {item.suggestions.map(
                          (suggest, i) => (

                            <div
                              key={i}
                              className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                              onClick={() =>
                                selectSuggestion(
                                  index,
                                  suggest
                                )
                              }
                            >
                              {suggest}
                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                  {/* SIZE */}

                  <input
                    type="text"
                    className="col-span-2 border p-3 rounded-xl"
                    placeholder="ขนาด"
                    value={item.size}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "size",
                        e.target.value
                      )
                    }
                  />

                  {/* QTY */}

                  <input
                    type="number"
                    className="col-span-2 border p-3 rounded-xl"
                    placeholder="จำนวน"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "qty",
                        Number(e.target.value)
                      )
                    }
                  />

                  {/* PRICE */}

                  <input
                    type="number"
                    className="col-span-2 border p-3 rounded-xl"
                    placeholder="ราคา"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "price",
                        Number(e.target.value)
                      )
                    }
                  />

                  {/* TOTAL */}

                  <div className="col-span-2 flex items-center justify-between bg-gray-100 rounded-xl px-4">

                    <div>
                      {item.qty * item.price}
                    </div>

                    <button
                      className="text-red-500"
                      onClick={() =>
                        removeItem(index)
                      }
                    >
                      ✕
                    </button>

                  </div>

                </div>

              ))}

              <button
                className="w-full border-2 border-dashed border-purple-400 p-3 rounded-xl text-purple-700"
                onClick={addItem}
              >
                + เพิ่มรายการสินค้า
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <div
            id="invoice"
            className="bg-white p-8 rounded-3xl"
          >

            {/* HEADER */}

            <div className="flex justify-between items-start">

              <div>

                <img
                  src="src/assets/img/5.png"
                  width="180"
                  alt=""
                />

                <div className="mt-4 text-[20px] leading-9">

                  ดีอาร์ อิงค์เจ็ท ปริ้นซ์
                  <br />

                  96 ตลาดสุขใจ ตำบลคลองหนึ่ง
                  <br />

                  อำเภอคลองหลวง จังหวัดปทุมธานี
                  <br />

                  โทร. 063 846 2546

                </div>

              </div>

              <div className="text-right">

                <div className="text-5xl font-black">
                  ใบสั่งซื้อสินค้า
                </div>

                <div className="mt-6 text-xl">
                  วันที่{" "}
                  {new Date().toLocaleDateString()}
                </div>

              </div>

            </div>

            {/* CUSTOMER */}

            <div className="grid grid-cols-2 gap-10 mt-10 text-xl">

              <div className="border-b-2 pb-2">
                ชื่อลูกค้า: {customer}
              </div>

              <div className="border-b-2 pb-2">
                เบอร์ติดต่อ: {phone}
              </div>

            </div>

            <div className="mt-5 text-xl border-b-2 pb-2">
              เลขประจำตัวผู้เสียภาษี:
              {" "}
              {taxId}
            </div>

            {/* TABLE */}

            <div className="mt-10 border-2 border-black rounded-[30px] overflow-hidden">

              {/* TABLE HEADER */}

              <div className="grid grid-cols-12 bg-[#2B2B2B] text-white font-bold text-lg">

                <div className="col-span-5 p-4 border-r border-white">
                  รายละเอียดสินค้า
                </div>

                <div className="col-span-2 p-4 border-r border-white text-center">
                  ขนาด
                </div>

                <div className="col-span-2 p-4 border-r border-white text-center">
                  จำนวน
                </div>

                <div className="col-span-2 p-4 border-r border-white text-center">
                  ราคา/หน่วย
                </div>

                <div className="col-span-1 p-4 text-center">
                  รวม
                </div>

              </div>

              {/* BODY */}

              <div>

                {/* DATA ROW */}

                {items.map((item, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-12 min-h-[65px] border-t border-black text-lg"
                  >

                    <div className="col-span-5 border-r border-black p-3 break-words">
                      {item.name}
                    </div>

                    <div className="col-span-2 border-r border-black p-3 text-center">
                      {item.size}
                    </div>

                    <div className="col-span-2 border-r border-black p-3 text-center">
                      {item.qty}
                    </div>

                    <div className="col-span-2 border-r border-black p-3 text-center">
                      {item.price}
                    </div>

                    <div className="col-span-1 p-3 text-center">
                      {item.qty * item.price}
                    </div>

                  </div>

                ))}

                {/* EMPTY ROWS */}

                {Array.from({
                  length:
                    emptyRows > 0
                      ? emptyRows
                      : 0,
                }).map((_, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-12 min-h-[65px] border-t border-black"
                  >

                    <div className="col-span-5 border-r border-black"></div>

                    <div className="col-span-2 border-r border-black"></div>

                    <div className="col-span-2 border-r border-black"></div>

                    <div className="col-span-2 border-r border-black"></div>

                    <div className="col-span-1"></div>

                  </div>

                ))}

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-between mt-10">

              <div className="w-[55%]">

                <div className="text-2xl font-bold">
                  *หมายเหตุ
                </div>

                <div className="mt-3 text-xl whitespace-pre-wrap">
                  {note}
                </div>

              </div>

              <div className="w-[35%]">

                <div className="border-2 border-black rounded-full px-6 py-3 text-2xl font-bold flex justify-between">

                  <span>
                    รวมทั้งสิ้น:
                  </span>

                  <span>
                    {total}
                  </span>

                </div>

                <div className="border-2 border-black rounded-[30px] mt-4 p-5">

                  <img
                    src="src/assets/img/6.png"
                    className="w-full"
                    alt=""
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}
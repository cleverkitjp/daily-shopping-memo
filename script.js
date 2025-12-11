(function () {
  "use strict";

  var STORAGE_KEY = "ck-daily-shopping-memo-v1";

  var PRESET_ITEMS = [
    // 冷蔵
    { id: "milk", name: "牛乳", category: "冷蔵", builtin: true },
    { id: "egg", name: "卵", category: "冷蔵", builtin: true },
    { id: "tofu", name: "豆腐", category: "冷蔵", builtin: true },
    { id: "natto", name: "納豆", category: "冷蔵", builtin: true },
    { id: "cheese", name: "チーズ", category: "冷蔵", builtin: true },
    { id: "yogurt", name: "ヨーグルト", category: "冷蔵", builtin: true },
    { id: "ham-bacon", name: "ハム・ベーコン", category: "冷蔵", builtin: true },
    { id: "cucumber", name: "きゅうり", category: "冷蔵", builtin: true },
    { id: "tomato", name: "トマト", category: "冷蔵", builtin: true },
    { id: "leafy", name: "葉物野菜", category: "冷蔵", builtin: true },
    { id: "meat", name: "肉（鶏・豚・牛）", category: "冷蔵", builtin: true },
    { id: "fish", name: "魚（刺身・切り身）", category: "冷蔵", builtin: true },

    // 冷凍
    { id: "frozen-noodle", name: "冷凍うどん／そば", category: "冷凍", builtin: true },
    { id: "frozen-rice", name: "冷凍ご飯（パック）", category: "冷凍", builtin: true },
    { id: "frozen-veg", name: "冷凍野菜", category: "冷凍", builtin: true },
    { id: "frozen-gyoza", name: "冷凍餃子", category: "冷凍", builtin: true },
    { id: "frozen-karaage", name: "冷凍からあげ", category: "冷凍", builtin: true },
    { id: "bread", name: "食パン（スライス）", category: "冷凍", builtin: true },

    // 常温食品
    { id: "rice", name: "米（お米）", category: "常温食品", builtin: true },
    { id: "pasta", name: "パスタ／麺", category: "常温食品", builtin: true },
    { id: "canned", name: "缶詰（ツナ／鯖など）", category: "常温食品", builtin: true },
    { id: "dried", name: "乾物（海苔／ワカメなど）", category: "常温食品", builtin: true },
    { id: "retort", name: "レトルト食品", category: "常温食品", builtin: true },
    { id: "cereal", name: "シリアル／グラノーラ", category: "常温食品", builtin: true },
    { id: "snack", name: "お菓子／スナック", category: "常温食品", builtin: true },

    // 調味料
    { id: "soy-sauce", name: "醤油", category: "調味料", builtin: true },
    { id: "miso", name: "味噌", category: "調味料", builtin: true },
    { id: "sugar", name: "砂糖", category: "調味料", builtin: true },
    { id: "salt", name: "塩", category: "調味料", builtin: true },
    { id: "oil", name: "油（サラダ油／オリーブ等）", category: "調味料", builtin: true },
    { id: "vinegar", name: "酢", category: "調味料", builtin: true },
    { id: "mayo", name: "マヨネーズ", category: "調味料", builtin: true },
    { id: "ketchup", name: "ケチャップ", category: "調味料", builtin: true },
    { id: "dashi", name: "顆粒だし", category: "調味料", builtin: true },

    // 飲み物
    { id: "water", name: "水（ミネラルウォーター）", category: "飲み物", builtin: true },
    { id: "tea", name: "お茶（緑茶／麦茶パック）", category: "飲み物", builtin: true },
    { id: "coffee-tea", name: "コーヒー／紅茶", category: "飲み物", builtin: true },
    { id: "juice", name: "ジュース", category: "飲み物", builtin: true },
    { id: "alcohol", name: "ビール／アルコール", category: "飲み物", builtin: true },

    // 日用品
    { id: "toilet-paper", name: "トイレットペーパー", category: "日用品", builtin: true },
    { id: "tissue", name: "ティッシュペーパー", category: "日用品", builtin: true },
    { id: "kitchen-paper", name: "キッチンペーパー", category: "日用品", builtin: true },
    { id: "dish-soap", name: "食器用洗剤", category: "日用品", builtin: true },
    { id: "laundry-soap", name: "洗濯用洗剤", category: "日用品", builtin: true },
    { id: "garbage-bag", name: "ゴミ袋", category: "日用品", builtin: true },
    { id: "sponge", name: "スポンジ／たわし", category: "日用品", builtin: true },
    { id: "wrap-foil", name: "ラップ／アルミホイル", category: "日用品", builtin: true },

    // ドラッグ
    { id: "shampoo", name: "シャンプー／コンディショナー", category: "ドラッグ", builtin: true },
    { id: "body-soap", name: "ボディソープ", category: "ドラッグ", builtin: true },
    { id: "toothpaste", name: "歯磨き粉", category: "ドラッグ", builtin: true },
    { id: "mask", name: "マスク", category: "ドラッグ", builtin: true },
    { id: "bandage", name: "バンドエイド（絆創膏）", category: "ドラッグ", builtin: true }
  ];

  var CATEGORY_ORDER = [
    "冷蔵",
    "冷凍",
    "常温食品",
    "調味料",
    "飲み物",
    "日用品",
    "ドラッグ",
    "カスタム"
  ];

  var state = null;

  var modeStockBtn;
  var modeShoppingBtn;
  var filterTodayCheckbox;
  var itemsContainer;
  var customForm;
  var customNameInput;
  var resetTodayBtn;
  var resetAllBtn;

  function createDefaultState() {
    return {
      version: 1,
      items: PRESET_ITEMS.map(function (item) {
        return {
          id: item.id,
          name: item.name,
          category: item.category,
          builtin: item.builtin,
          buy: false,
          done: false
        };
      }),
      settings: {
        mode: "stock",
        filterToday: false
      }
    };
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object" || !data.items) {
        return createDefaultState();
      }

      data.items = data.items.map(function (item) {
        return {
          id: item.id,
          name: item.name,
          category: item.category || "カスタム",
          builtin: !!item.builtin,
          buy: !!item.buy,
          done: !!item.done
        };
      });

      data.settings = data.settings || {};
      if (data.settings.mode !== "stock" && data.settings.mode !== "shopping") {
        data.settings.mode = "stock";
      }
      data.settings.filterToday = !!data.settings.filterToday;

      data.version = 1;

      return data;
    } catch (e) {
      console.warn("loadState error", e);
      return createDefaultState();
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("saveState error", e);
    }
  }

  function setMode(mode) {
    if (mode !== "stock" && mode !== "shopping") return;
    state.settings.mode = mode;
    render();
    saveState();
  }

  function setFilterToday(flag) {
    state.settings.filterToday = !!flag;
    render();
    saveState();
  }

  function addCustomItem(name) {
    var trimmed = name.trim();
    if (!trimmed) return;

    var baseId =
      "custom-" +
      trimmed
        .replace(/\s+/g, "-")
        .replace(/[^\w\-ぁ-んァ-ン一-龠]/g, "")
        .toLowerCase();

    if (!baseId) {
      baseId = "custom-item";
    }

    var id = baseId;
    var suffix = 1;
    while (
      state.items.some(function (it) {
        return it.id === id;
      })
    ) {
      id = baseId + "-" + suffix;
      suffix += 1;
    }

    state.items.push({
      id: id,
      name: trimmed,
      category: "カスタム",
      builtin: false,
      buy: true,
      done: false
    });

    render();
    saveState();
  }

  function deleteItemById(id) {
    state.items = state.items.filter(function (item) {
      return item.id !== id;
    });
    render();
    saveState();
  }

  function resetToday() {
    state.items.forEach(function (item) {
      item.buy = false;
      item.done = false;
    });
    state.settings.mode = "stock";
    render();
    saveState();
  }

  function resetAll() {
    state = createDefaultState();
    render();
    saveState();
  }

  function handleBuyChange(item, checked) {
    item.buy = !!checked;
    if (!item.buy) {
      item.done = false;
    }
    render();
    saveState();
  }

  function handleDoneToggle(item) {
    if (state.settings.mode !== "shopping") return;
    if (!item.buy) return;
    item.done = !item.done;
    render();
    saveState();
  }

  function render() {
    modeStockBtn.classList.toggle("active", state.settings.mode === "stock");
    modeShoppingBtn.classList.toggle(
      "active",
      state.settings.mode === "shopping"
    );
    filterTodayCheckbox.checked = state.settings.filterToday;

    itemsContainer.innerHTML = "";

    CATEGORY_ORDER.forEach(function (category) {
      var catItems = state.items.filter(function (item) {
        return item.category === category;
      });

      if (state.settings.filterToday) {
        catItems = catItems.filter(function (item) {
          return item.buy;
        });
      }

      if (catItems.length === 0) {
        return;
      }

      var card = document.createElement("section");
      card.className = "category-card card";

      var header = document.createElement("div");
      header.className = "category-header";

      var title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = category;

      var count = document.createElement("div");
      count.className = "category-count";
      count.textContent = catItems.length + "件";

      header.appendChild(title);
      header.appendChild(count);
      card.appendChild(header);

      catItems.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "item-row";
        row.dataset.id = item.id;

        if (item.buy) {
          row.classList.add("is-buy");
        }
        if (item.done) {
          row.classList.add("is-done");
        }

        var main = document.createElement("div");
        main.className = "item-main";

        var buyLabel = document.createElement("label");
        buyLabel.className = "buy-label";

        var buyCheckbox = document.createElement("input");
        buyCheckbox.type = "checkbox";
        buyCheckbox.className = "buy-checkbox";
        buyCheckbox.checked = item.buy;

        buyCheckbox.addEventListener("change", function () {
          handleBuyChange(item, buyCheckbox.checked);
        });

        var buyText = document.createElement("span");
        buyText.textContent = "買う";

        buyLabel.appendChild(buyCheckbox);
        buyLabel.appendChild(buyText);

        var nameSpan = document.createElement("span");
        nameSpan.className = "item-name";
        nameSpan.textContent = item.name;
        if (item.done) {
          nameSpan.classList.add("done");
        }

        main.appendChild(buyLabel);
        main.appendChild(nameSpan);

        var actions = document.createElement("div");
        actions.className = "item-actions";

        var doneButton = document.createElement("button");
        doneButton.type = "button";
        doneButton.className = "done-button";

        if (state.settings.mode === "shopping") {
          if (item.buy) {
            if (item.done) {
              doneButton.classList.add("completed");
              doneButton.textContent = "購入済み";
            } else {
              doneButton.classList.add("pending");
              doneButton.textContent = "カゴに入れたらタップ";
            }
            doneButton.addEventListener("click", function () {
              handleDoneToggle(item);
            });
          } else {
            doneButton.classList.add("disabled");
            doneButton.textContent = "対象外";
          }
        } else {
          doneButton.classList.add("disabled");
          doneButton.textContent = "買い物中に使用";
        }

        actions.appendChild(doneButton);

        if (!item.builtin && category === "カスタム") {
          var delButton = document.createElement("button");
          delButton.type = "button";
          delButton.className = "delete-button";
          delButton.setAttribute("aria-label", "削除");
          delButton.textContent = "×";
          delButton.addEventListener("click", function (e) {
            e.stopPropagation();
            if (window.confirm("この品目をリストから削除しますか？")) {
              deleteItemById(item.id);
            }
          });
          actions.appendChild(delButton);
        }

        row.appendChild(main);
        row.appendChild(actions);
        card.appendChild(row);
      });

      itemsContainer.appendChild(card);
    });
  }

  function init() {
    modeStockBtn = document.getElementById("mode-stock-btn");
    modeShoppingBtn = document.getElementById("mode-shopping-btn");
    filterTodayCheckbox = document.getElementById("filter-today");
    itemsContainer = document.getElementById("items-container");
    customForm = document.getElementById("custom-form");
    customNameInput = document.getElementById("custom-name");
    resetTodayBtn = document.getElementById("reset-today-btn");
    resetAllBtn = document.getElementById("reset-all-btn");

    state = loadState();

    modeStockBtn.addEventListener("click", function () {
      setMode("stock");
    });

    modeShoppingBtn.addEventListener("click", function () {
      setMode("shopping");
    });

    filterTodayCheckbox.addEventListener("change", function () {
      setFilterToday(filterTodayCheckbox.checked);
    });

    customForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = customNameInput.value || "";
      if (!value.trim()) return;
      addCustomItem(value);
      customNameInput.value = "";
    });

    resetTodayBtn.addEventListener("click", function () {
      if (
        window.confirm(
          "今日の買い物フラグ（買う／購入済み）をすべてリセットしますか？\n追加した品目自体は残ります。"
        )
      ) {
        resetToday();
      }
    });

    resetAllBtn.addEventListener("click", function () {
      if (
        window.confirm(
          "すべて初期化して、プリセットだけの状態に戻しますか？\n追加した品目はすべて削除されます。"
        )
      ) {
        resetAll();
      }
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

# フラッシュ暗算


## ゲーム設定

### 簡易設定
- 簡単
- 普通
- 難しい
- 詳細設定

### 詳細設定
- 桁数：1~5桁
- HP：桁数×1、10、100
- 表示時間：0.1~1秒

## 通信内容

### クライアントからサーバー
- r: 部屋検索　{s_roomName}
- s: ゲーム設定変更 {p_editedProperty}
- b: ゲームスタート 
- a: 回答送信 {n_answer}

### サーバーからクライアント
- n: 部屋通知 {s_playerNames[]}
- j: プレイヤー入室通知 {s_playerNames[]}
- p: 問題送信 {n_numbers[]}
- r: 結果通知 [{playerName, number, hp}]
- s: ゲーム設定反映 {p_editedProperties}
- b: 開始通知 {s_playerNames[]}
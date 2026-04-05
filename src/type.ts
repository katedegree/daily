// タスク
export interface Task {
  id: string; // タスクID
  createdDate: string; // 作成日時[YYYYMMDD]
  completedDate: string | null; // 完了日時[YYYYMMDD]
  origin: Origin; // 発端
  background: Background[]; // 経緯
}

// 発端
export interface Origin {
  goal: string; // 目的
  reason: string; // 理由
  action: string; // 行動
  hypotheses: string[]; // 達成までの仮定
}

// 経緯
export interface Background {
  hypotheses: string[]; // 達成までの仮定
  purpose: string; // 問題点
  plan: string; // 計画
  createdDate: string; // 作成日時[YYYYMMDD]
}

// 探求
export interface Inquiry {
  question: string; // 疑問
  hypothesis: string; // 仮説
}

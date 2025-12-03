export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 提交类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档变更
        'style',    // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf',     // 性能优化
        'test',     // 测试
        'chore',    // 构建过程或辅助工具的变动
        'revert',   // 回滚
        'build',    // 构建
        'ci',       // CI配置
      ],
    ],
    // 提交类型不能为空
    'type-empty': [2, 'never'],
    // 提交主题不能为空
    'subject-empty': [2, 'never'],
    // 提交主题最大长度
    'subject-max-length': [2, 'always', 100],
  },
};

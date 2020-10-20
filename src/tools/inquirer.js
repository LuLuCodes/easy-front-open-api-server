import inquirer from 'inquirer';

export default {
  getQuestions: () => {
    const questions = [
      {
        type: 'list',
        message: '选择功能:',
        name: 'function',
        choices: [
          { name: '新增AppKey', value: 'add-app-key' },
          { name: '查询AppKey', value: 'query-app-key' },
          { name: '列举AppKey', value: 'list-app-key' },
          { name: '删除AppKey', value: 'del-app-key' },
        ],
      },
      {
        type: 'input',
        message: '输入第三方名称:',
        name: 'developName',
        when(answer) {
          return answer.function === 'add-app-key';
        },
      },
      {
        type: 'input',
        message: '输入AppKey:',
        name: 'appKey',
        when(answer) {
          return (
            answer.function === 'add-app-key' ||
            answer.function === 'query-app-key' ||
            answer.function === 'del-app-key'
          );
        },
      },
    ];
    return inquirer.prompt(questions);
  },
};

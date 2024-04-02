export const commentTemplate = {
  content: `
    <!DOCTYPE html>
      <html>
        <head>
          <title>[팀+] 댓글 알림</title>
        </head>
        <body>
          <h1>{{name}}님, 안녕하세요.</h1>
          <p>{{projectName}}에 댓글이 달렸습니다.</p>
        </body>
      </html>
  `,
};

export const commentReplyTemplate = {
  content: `
    <!DOCTYPE html>
      <html>
        <head>
          <title>[팀+] 대댓글 알림</title>
        </head>
        <body>
          <h1>{{name}}님, 안녕하세요.</h1>
          <p>댓글에 대한 대댓글이 달렸습니다.</p>
        </body>
      </html>
  `,
};

1. 项目概述
本项目旨在搭建一个极简化的 在线 SQL 学习平台，让初学者无需安装任何客户端或插件，只需在浏览器中登录即可在示例银行数据库上执行 SQL 查询，并完成基础的银行业务数据分析练习。

核心思路：

单服务器/单容器部署：在同一环境中运行 Web 应用（Flask/Django）和数据库（MySQL/PostgreSQL）。
简易前端界面：基于后端模板渲染，提供一个文本框输入 SQL，以及结果展示区域。
Cursor 编程：使用 Python 数据库驱动（如 pymysql 或 psycopg2），通过 cursor 执行学员输入的 SQL，返回执行结果。
最小化安全控制：对危险的 SQL（如 DROP、TRUNCATE）进行拦截；为练习用户创建权限受限的数据库账号。
2. 目录结构
建议将本项目组织为如下目录与文件：

csharp
复制代码
my-sql-learning-platform/
│
├─ design.md              # 设计文档 (本文件)
│
├─ requirements.txt       # Python依赖列表 (Flask, pymysql/psycopg2 等)
│
├─ run.sh                 # 便捷启动脚本 (可选)
│
├─ init_db/
│   ├─ init_tables.sql    # 建表脚本，创建 customers/accounts/transactions/loans 等
│   ├─ insert_data.sql    # 插入示例数据
│   └─ ...
│
├─ web_app/
│   ├─ app.py             # Flask/Django主入口，核心业务逻辑
│   ├─ config.py          # 数据库连接、全局配置等
│   ├─ templates/
│   │   ├─ base.html      # 主模板
│   │   ├─ index.html     # 首页/登录页面
│   │   ├─ playground.html# SQL 编辑器页面
│   │   └─ ...
│   └─ static/
│       ├─ css/
│       ├─ js/
│       └─ ...
│
└─ README.md              # 简要说明如何安装、运行项目
如有需要，可将数据库与 Web 应用分别容器化，或进一步拆分目录结构，但此处仅提供最小可行版本。

3. 核心技术要点
3.1 数据库与示例数据
类型：建议使用 MySQL 或 PostgreSQL。
示例银行表：
customers(customer_id, name, gender, address, phone, created_at, ...)
accounts(account_id, customer_id, account_type, balance, opened_at, ...)
transactions(trans_id, account_id, trans_type, amount, trans_time, reference, ...)
loans(loan_id, customer_id, loan_amount, loan_status, created_at, ...)
初始化脚本：
init_tables.sql：包含 CREATE TABLE 语句等。
insert_data.sql：示例数据，以便学员做聚合、连接等查询练习。
数据库用户：
建议创建一个权限受限账号（如 student_user），仅允许 SELECT/INSERT/UPDATE/DELETE 等基础操作；禁止 DROP、CREATE、GRANT 等高级操作。
3.2 Web 应用 (Flask 示例)
依赖：
Flask 用于快速搭建 Web Server。
pymysql（或 psycopg2）用于 MySQL/PostgreSQL 的连接及 cursor 编程。
应用入口 (app.py)：
主要路由示例：
GET /：显示首页/登录页或直接跳转到 SQL Playground。
POST /playground：接收学员输入的 SQL 语句，用 cursor 执行，返回结果或错误。
Cursor 编程：
python
复制代码
import pymysql
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def sql_playground():
    results = []
    error_msg = None
    if request.method == 'POST':
        user_sql = request.form.get('sql_query', '')
        # 简易过滤
        if "DROP" in user_sql.upper() or "TRUNCATE" in user_sql.upper():
            error_msg = "禁止执行破坏性SQL命令。"
        else:
            try:
                conn = pymysql.connect(
                    host='localhost',
                    user='student_user',
                    password='123456',
                    database='bank_example'
                )
                cursor = conn.cursor()
                cursor.execute(user_sql)
                results = cursor.fetchall()
                conn.commit()
            except Exception as e:
                error_msg = str(e)
            finally:
                cursor.close()
                conn.close()
    return render_template('playground.html', results=results, error_msg=error_msg)
根据需求，可在 config.py 中管理数据库连接配置，并在 app.py 中引入。
3.3 前端页面 (templates)
playground.html (伪码示意)

html
复制代码
<!DOCTYPE html>
<html>
<head>
    <title>SQL Playground</title>
</head>
<body>
    <h1>在线 SQL 学习平台</h1>
    <form method="POST" action="/">
        <label for="sql_query">输入 SQL 语句:</label><br>
        <textarea name="sql_query" rows="5" cols="60"></textarea><br><br>
        <button type="submit">执行</button>
    </form>
    {% if error_msg %}
        <p style="color:red;">{{ error_msg }}</p>
    {% endif %}
    {% if results %}
        <h3>查询结果:</h3>
        <table border="1">
            <tr>
            {% for col in results[0]._fields if results[0]._fields else range(len(results[0])) %}
                <th>{{ col }}</th>
            {% endfor %}
            </tr>
            {% for row in results %}
            <tr>
                {% for cell in row %}
                <td>{{ cell }}</td>
                {% endfor %}
            </tr>
            {% endfor %}
        </table>
    {% endif %}
</body>
</html>
上述仅作示例，实际可用更优雅的方式渲染表格。
课程页面

若需要简单的课程或测验介绍，可加 course.html, quiz.html 等；放置文字、图片、简答题，都是可选项。
3.4 安全与权限
SQL 过滤：只是一种初步手段，若要更安全，可以基于正则或语法解析器做更严格的白名单匹配。
最小权限：在数据库层面，只给练习账号最小化操作权限，杜绝误操作影响到系统数据库。
4. 启动与使用
安装依赖

bash
复制代码
pip install -r requirements.txt
初始化数据库

bash
复制代码
# 假设已安装MySQL或PostgreSQL
# 进入数据库客户端:
source init_db/init_tables.sql
source init_db/insert_data.sql

# 创建用户并赋权限:
CREATE USER 'student_user'@'%' IDENTIFIED BY '123456';
GRANT SELECT, INSERT, UPDATE, DELETE ON bank_example.* TO 'student_user'@'%';
FLUSH PRIVILEGES;
运行 Web 应用

bash
复制代码
cd web_app
export FLASK_APP=app.py
flask run --host=0.0.0.0 --port=80
然后访问 http://<服务器IP>/，即可看到简易的 SQL Playground。
生产部署 (可选)

使用 Nginx 反向代理、Gunicorn/Uwsgi 提高并发和稳定性；
配置 HTTPS 证书并使用域名。
5. 后续扩展
用户管理：若有需要，可加登录/注册功能，并记录学员练习历史。
测验系统：可以添加题库表、自动判分机制。
UI 优化：可引入前端框架或在线编辑器组件（ACE、CodeMirror）实现语法高亮。
更多业务表：可加入信用卡、理财产品、风险管理等更接近真实银行业务的场景。
至此，项目的基本功能与架构已足以满足「通过游览器在线执行 SQL、查看结果」的需求，后续若需要更丰富的功能或更严格的安全策略，可在此基础上迭代升级。
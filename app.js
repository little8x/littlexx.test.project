
document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('jsonInput');
    const outputArea = document.getElementById('outputArea');
    const errorArea = document.getElementById('errorArea');
    const autoFormat = document.getElementById('autoFormat');
    const darkMode = document.getElementById('darkMode');

    // 示例数据
    document.getElementById('exampleBtn').addEventListener('click', () => {
        jsonInput.value = JSON.stringify({
            name: "John Doe",
            age: 30,
            isActive: true,
            address: {
                street: "123 Main St",
                city: "New York"
            },
            hobbies: ["reading", "hiking", "photography"],
            scores: [85, 92, 78]
        }, null, 2);
    });

    // 清空输入
    document.getElementById('clearBtn').addEventListener('click', () => {
        jsonInput.value = '';
        outputArea.textContent = '';
        errorArea.classList.add('hidden');
    });

    // 格式化JSON
    document.getElementById('formatBtn').addEventListener('click', formatJson);

    // 压缩JSON
    document.getElementById('minifyBtn').addEventListener('click', minifyJson);

    // 验证JSON
    document.getElementById('validateBtn').addEventListener('click', validateJson);

    // 转换为XML
    document.getElementById('toXmlBtn').addEventListener('click', convertToXml);

    // 转换为CSV
    document.getElementById('toCsvBtn').addEventListener('click', convertToCsv);

    // 转换为YAML
    document.getElementById('toYamlBtn').addEventListener('click', convertToYaml);

    // Base64编码
    document.getElementById('toBase64Btn').addEventListener('click', encodeBase64);

    // Base64解码
    document.getElementById('fromBase64Btn').addEventListener('click', decodeBase64);

    // 复制结果
    document.getElementById('copyBtn').addEventListener('click', copyOutput);

    // 下载结果
    document.getElementById('downloadBtn').addEventListener('click', downloadOutput);

    // 暗黑模式切换
    darkMode.addEventListener('change', toggleDarkMode);

    // 核心功能函数
    function formatJson() {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            outputArea.textContent = JSON.stringify(jsonObj, null, 2);
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('无效的JSON格式: ' + e.message);
        }
    }

    function minifyJson() {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            outputArea.textContent = JSON.stringify(jsonObj);
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('无效的JSON格式: ' + e.message);
        }
    }

    function validateJson() {
        try {
            JSON.parse(jsonInput.value);
            outputArea.textContent = '✓ 有效的JSON格式';
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('无效的JSON格式: ' + e.message);
        }
    }

    function convertToXml() {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            outputArea.textContent = jsonToXml(jsonObj);
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('转换失败: ' + e.message);
        }
    }

    function convertToCsv() {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            outputArea.textContent = jsonToCsv(jsonObj);
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('转换失败: ' + e.message);
        }
    }

    function convertToYaml() {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            outputArea.textContent = jsonToYaml(jsonObj);
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('转换失败: ' + e.message);
        }
    }

    function encodeBase64() {
        try {
            const str = jsonInput.value;
            outputArea.textContent = btoa(unescape(encodeURIComponent(str)));
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('编码失败: ' + e.message);
        }
    }

    function decodeBase64() {
        try {
            const str = jsonInput.value;
            outputArea.textContent = decodeURIComponent(escape(atob(str)));
            errorArea.classList.add('hidden');
        } catch (e) {
            showError('解码失败: ' + e.message);
        }
    }

    // 辅助函数
    function jsonToXml(obj, nodeName = 'root') {
        let xml = '';
        if (obj === null || obj === undefined) {
            return `<${nodeName}></${nodeName}>`;
        }

        if (typeof obj !== 'object') {
            return `<${nodeName}>${obj}</${nodeName}>`;
        }

        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                xml += jsonToXml(obj[i], nodeName + '_item');
            }
        } else {
            xml += `<${nodeName}>`;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    xml += jsonToXml(obj[key], key);
                }
            }
            xml += `</${nodeName}>`;
        }
        return xml;
    }

    function jsonToCsv(obj) {
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '';

            // 获取所有可能的键
            const allKeys = new Set();
            obj.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    Object.keys(item).forEach(key => allKeys.add(key));
                }
            });

            const headers = Array.from(allKeys);
            let csv = headers.join(',') + '\n';

            obj.forEach(item => {
                const row = headers.map(header => {
                    if (item && typeof item === 'object' && header in item) {
                        const value = item[header];
                        if (value === null || value === undefined) return '';
                        if (Array.isArray(value) || typeof value === 'object') {
                            return JSON.stringify(value);
                        }
                        return `"${String(value).replace(/"/g, '""')}"`;
                    }
                    return '';
                });
                csv += row.join(',') + '\n';
            });

            return csv;
        } else if (typeof obj === 'object' && obj !== null) {
            return jsonToCsv([obj]);
        } else {
            return String(obj);
        }
    }

    function jsonToYaml(obj, indent = '') {
        if (obj === null || obj === undefined) return 'null';

        if (typeof obj !== 'object') {
            if (typeof obj === 'string') return `"${obj.replace(/"/g, '\\"')}"`;
            return String(obj);
        }

        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';

            let yaml = '';
            obj.forEach(item => {
                yaml += `${indent}- ${jsonToYaml(item, indent + '  ')}\n`;
            });
            return yaml.trimEnd();
        } else {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '{}';

            let yaml = '';
            keys.forEach(key => {
                const value = obj[key];
                yaml += `${indent}${key}: ${jsonToYaml(value, indent + '  ')}\n`;
            });
            return yaml.trimEnd();
        }
    }

    function copyOutput() {
        const text = outputArea.textContent;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i>已复制';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }

    function downloadOutput() {
        const text = outputArea.textContent;
        if (!text) return;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'json_converter_output.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showError(message) {
        errorArea.textContent = message;
        errorArea.classList.remove('hidden');
        outputArea.textContent = '';
    }

    function toggleDarkMode() {
        document.body.classList.toggle('bg-gray-900');
        document.body.classList.toggle('text-white');

        const cards = document.querySelectorAll('.bg-white');
        cards.forEach(card => {
            card.classList.toggle('bg-gray-800');
            card.classList.toggle('text-gray-100');
        });

        outputArea.classList.toggle('bg-gray-700');
    }

    // 自动格式化输入
    jsonInput.addEventListener('blur', () => {
        if (autoFormat.checked) {
            try {
                const jsonObj = JSON.parse(jsonInput.value);
                jsonInput.value = JSON.stringify(jsonObj, null, 2);
            } catch (e) {
                // 不是JSON则不处理
            }
        }
    });
});

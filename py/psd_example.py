'''
Author: chan-max jackieontheway666@gmail.com
Date: 2025-05-25 18:51:20
LastEditors: chan-max jackieontheway666@gmail.com
LastEditTime: 2025-05-25 19:20:12
FilePath: /design-server/py/psd_example.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
from psd_tools import PSDImage
from PIL import Image
import os

def process_psd(psd_path):
    """
    处理 PSD 文件并展示其基本信息
    """
    # 加载 PSD 文件
    psd = PSDImage.open(psd_path)
    
    # 打印基本信息
    print(f"PSD 文件信息:")
    print(f"尺寸: {psd.size}")
    print(f"颜色模式: {psd.color_mode}")
    print(f"图层数量: {len(psd._layers)}")
    
    # 打印每个图层的信息
    print("\n图层信息:")
    for i, layer in enumerate(psd._layers):
        print(f"图层 {i+1}:")
        print(f"  - 名称: {layer.name}")
        print(f"  - 可见性: {layer.visible}")
        print(f"  - 尺寸: {layer.size}")
        print(f"  - 位置: {layer.offset}")
    
    # 将 PSD 转换为 PNG
    output_path = os.path.splitext(psd_path)[0] + '.png'
    psd.composite().save(output_path)
    print(f"\n已将 PSD 转换为 PNG 并保存至: {output_path}")

def export_psd_to_png(psd_path, output_path=None):
    """
    将PSD文件导出为PNG整图
    :param psd_path: PSD文件路径
    :param output_path: PNG输出路径（可选），默认为与PSD同名的PNG
    :return: 实际输出的PNG路径
    """
    psd = PSDImage.open(psd_path)
    if output_path is None:
        output_path = os.path.splitext(psd_path)[0] + '.png'
    psd.composite().save(output_path)
    print(f"已将 PSD 转换为 PNG 并保存至: {output_path}")
    return output_path

def export_psd_groups_to_folder(psd_path, output_folder):
    """
    将 PSD 文件中每个组（图层）分别导出为 PNG 图片，并保存到指定文件夹中
    :param psd_path: PSD 文件路径
    :param output_folder: 输出文件夹路径
    :return: 导出的 PNG 文件路径列表
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    psd = PSDImage.open(psd_path)
    output_paths = []
    for i, layer in enumerate(psd._layers):
        if layer.is_group():
            # 如果是组，则导出该组
            group_name = layer.name
            output_path = os.path.join(output_folder, f"{group_name}.png")
            layer.composite().save(output_path)
            output_paths.append(output_path)
            print(f"已将组 {group_name} 导出为: {output_path}")
    return output_paths

def find_smart_objects(psd_path):
    """
    寻找 PSD 中的智能对象
    :param psd_path: PSD 文件路径
    :return: 智能对象信息列表
    """
    psd = PSDImage.open(psd_path)
    smart_objects = []
    for i, layer in enumerate(psd._layers):
        if hasattr(layer, 'smart_object') and layer.smart_object:
            smart_objects.append({
                'name': layer.name,
                'index': i,
                'visible': layer.visible,
                'size': layer.size,
                'offset': layer.offset
            })
    return smart_objects

def replace_smart_object_and_export(psd_path, smart_object_index, replacement_image_path, output_psd_path):
    """
    将 PSD 中的智能对象替换为指定图片，并导出为新的 PSD 文件
    :param psd_path: PSD 文件路径
    :param smart_object_index: 智能对象的索引
    :param replacement_image_path: 替换图片的路径
    :param output_psd_path: 输出 PSD 文件路径
    :return: 输出 PSD 文件路径
    """
    psd = PSDImage.open(psd_path)
    if 0 <= smart_object_index < len(psd._layers):
        layer = psd._layers[smart_object_index]
        if hasattr(layer, 'smart_object') and layer.smart_object:
            # 替换智能对象
            replacement_image = Image.open(replacement_image_path)
            layer.smart_object = replacement_image
            # 导出为新的 PSD 文件
            psd.save(output_psd_path)
            print(f"已将智能对象替换并导出为: {output_psd_path}")
            return output_psd_path
    print("未找到指定的智能对象或替换失败")
    return None

if __name__ == "__main__":
    # 示例用法
    psd_path = "./s.psd"  # 请替换为实际的 PSD 文件路径
    if os.path.exists(psd_path):
        process_psd(psd_path)
    else:
        print(f"错误: 找不到文件 {psd_path}")

    # 进一步集成示例
    # export_psd_to_png('./s.psd', './s_exported.png')
    # export_psd_groups_to_folder('./s.psd', './output_groups')

    smart_objects = find_smart_objects('./s.psd')
    print(smart_objects)

    replace_smart_object_and_export('./s.psd', 9, './test.jpg', './s_replaced.psd') 
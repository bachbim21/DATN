import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import React, { useContext, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, getCycleOption, getEquipmentCategoryOptions, getRiskLevelOptions, options } from 'utils/globalFunc.util';
import { useNavigate } from 'react-router-dom';
import equipmentApi from 'api/equipment.api';
import { FilterContext } from 'contexts/filter.context';
import categoryApi from 'api/category.api';
import { UpsertEquipmentForm } from '../../../../types/equipment.type';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TextArea } = Input;

const CreateEquipment = () => {

  const { equipmentCategories, equipmentUnits, equipmentGroups, providers, projects } = useContext(FilterContext);
  const navigate = useNavigate();
  const [form] = Form.useForm<UpsertEquipmentForm>();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [type, setType] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [imageToBeUploaded, setImageToBeUploaded] = useState<any>(null);
  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    setImageToBeUploaded(file);
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const createEquipment = (form: UpsertEquipmentForm) => {
    equipmentApi.createEquipment(form, imageToBeUploaded).then((res) => {
      navigate(`/equipments/${res.data.data.id}`);
      toast.success('Tạo thiết bị thành công!');
    });
  };

  const onChangeGroup = (value: any) => {
    categoryApi.listTypeBaseGroup(value)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setType(data?.types);
        }
      })
      .catch();
  };

  return (<div>
    <div className='flex-between-center'>
      <div className='title'>NHẬP THIẾT BỊ</div>
      {/*<Button className='button_excel'>
        <ImportOutlined />
        <div
          className='font-medium text-md text-[#5B69E6]'
          onClick={() => navigate('/equipment/import_excel_eq')}
        >Nhập Excel
        </div>
      </Button>*/}
    </div>
    <Divider />
    <div className='flex-between mt-10'>
      <Form
        form={form}
        className='basis-2/3'
        layout='vertical'
        size='large'
        onFinish={createEquipment}
      >
        <div className='grid grid-cols-3 gap-5'>
          <Form.Item
            label='Tên thiết bị'
            name='name'
            required
            rules={[{ required: true, message: 'Hãy nhập tên thiết bị!' }]}
            className='mb-5'
          >
            <Input placeholder='Nhập tên thiết bị' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label=' Model'
            required
            rules={[{ required: true, message: ' Hãy nhập Model' }]}
            className='mb-5'
            name='model'
          >
            <Input
              placeholder=' Nhập Model thiết bị' allowClear className='input'
            />
          </Form.Item>
          <Form.Item
            name='serial'
            label=' Serial'
            required
            rules={[{ required: true, message: ' Hãy nhập Serial' }]}
            className='mb-5'
          >
            <Input
              placeholder=' Nhập Serial thiết bị' allowClear className='input'
            />
          </Form.Item>
        </div>

        <div className='grid grid-cols-3 gap-5'>
          <Form.Item
            label='Mã thiết bị'
            name='hashCode'
            required
            rules={[{ required: true, message: 'Hãy nhập mã thiết bị!' }]}
            className='mb-5'
          >
            <Input
              placeholder='Nhập mã thiết bị' allowClear className='input'
            />
          </Form.Item>
          <Form.Item
            label='Nhóm thiết bị' className='mb-5'
            required
            name='groupId'
            rules={[{ required: true, message: ' Hãy chọn nhóm thiết bị!' }]}>
            <Select
              showSearch
              placeholder='Chọn nhóm thiết bị'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(equipmentGroups)}
              onChange={value => {
                form.setFieldsValue({ categoryId: undefined });
              }}
              onClear={() => form.setFieldsValue({ categoryId: undefined })}
            />
          </Form.Item>
          <Form.Item
            label='Loại thiết bị'
            name='categoryId'
            required
            rules={[{ required: true, message: 'Hãy chọn loại thiết bị!' }]}
            className='mb-5'
          >
            <Select
              showSearch
              placeholder='Chọn loại thiết bị'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={getEquipmentCategoryOptions(equipmentCategories, form.getFieldValue('groupId') as number)}
            />
          </Form.Item>

        </div>
        <div className='grid grid-cols-3 gap-5'>
          <Form.Item
            label='Đơn vị tính'
            name='unitId'
            required
            rules={[{ required: true, message: 'Hãy chọn đơn vị tính thiết bị!' }]}
            className='mb-5'
          >
            <Select
              showSearch
              placeholder='Chọn đơn vị tính'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(equipmentUnits)}
            />
          </Form.Item>
          {/* <Form.Item
            label='Mức độ rủi ro'
            name='riskLevel'
            required
            rules={[{ required: true, message: 'Hãy chọn mức độ rủi ro của thiết bị!' }]}
            className='mb-5'
          >
            <Select
              showSearch
              placeholder='Chọn mức độ rủi ro'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={getRiskLevelOptions()}
            />
          </Form.Item> */}
          <Form.Item
            label='Giá nhập' name='importPrice' className='mb-5'
            rules={[{ pattern: /^[0-9]*$/, message: 'Giá nhập phải là số' }]}
          >
            <Input placeholder='Nhập giá thiết bị' allowClear className='rounded-lg h-9 border-[#A3ABEB] border-2' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-3 gap-5'>
        </div>
        <div className='grid grid-cols-3 gap-5'>
          <Form.Item
            label='Hãng sản xuất'
            name='manufacturer'
            className='mb-5'
          >
            <Input placeholder='Nhập hãng sản xuất của thiết bị' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label='Xuất xứ'
            name='manufacturingCountry'
            className='mb-5'
          >
            <Input placeholder='Nhập xuất xứ của thiết bị' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label='Năm sản xuất'
            name='yearOfManufacture'
            className='mb-5'
            rules={[
              { pattern: /^[0-9]*$/, message: 'Năm sản xuất phải là số!' }, { min: 4, max: 4, message: 'Năm sản xuất phải có 4 chữ số!' },
            ]}
          >
            <Input placeholder='Nhập năm sản xuất của thiết bị' allowClear className='input' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-3 gap-5'>
          <Form.Item
            label='Bảo dưỡng định kỳ' name='regularMaintenance' className='mb-5'
          >
            <Select
              showSearch
              placeholder='Chọn tháng'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={getCycleOption()}
            >
            </Select>
          </Form.Item>
          {/* <Form.Item label='Kiểm định định kỳ' name='regularInspection' className='mb-5'>
            <Select
              showSearch
              placeholder='Chọn tháng'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={getCycleOption()}
            >
            </Select>
          </Form.Item> */}
          <Form.Item label='Nhà cung cấp' name='providerId' className='mb-5'>
            <Select
              showSearch
              placeholder='Chọn nhà cung cấp'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(providers)}
            />
          </Form.Item>
        </div>
        <div className='grid grid-cols-3 gap-5'>
          <Form.Item label='Ngày nhập kho (Y/M/D)' name='warehouseImportDate' className='mb-5'>
            <DatePicker className='input w-[-webkit-fill-available]' placeholder='Y/M/D' />
          </Form.Item>
          <Form.Item label='Ngày hết hạn bảo hành (Y/M/D)' name='warrantyExpirationDate' className='mb-5'>
            <DatePicker className='input w-[-webkit-fill-available]' placeholder='Y/M/D' />
          </Form.Item>
          <Form.Item label='Thời điểm hết hợp đồng LDLK (Y/M/D)' name='jointVentureContractExpirationDate' className='mb-5'>
            <DatePicker className='input w-[-webkit-fill-available]' placeholder='Y/M/D' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label='Thông số kĩ thuật' name='technicalParameter' className='mb-5'>
            <TextArea placeholder='Thông số kĩ thuật' rows={4} className='textarea' />
          </Form.Item>
          <Form.Item label='Cấu hình kĩ thuật' name='configuration' className='mb-5'>
            <TextArea placeholder='Cấu hình kĩ thuật' rows={4} className='textarea' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item
            label='Giá trị ban đầu' name='initialValue' className='mb-5'
            rules={[{ pattern: /^[0-9]*$/, message: 'Giá trị ban đầu phải là số!' }]}
          >
            <Input placeholder='Nhập giá trị ban đầu của thiết bị' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label='Khấu hao hàng năm' name='annualDepreciation' className='mb-5'

            rules={[{ pattern: /^[0-9]*$/, message: 'Khấu hao hàng năm phải là số!' }]}
          >
            <Input placeholder='Nhập Khấu hao hàng năm' allowClear className='input' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-3 gap-5'>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item
            label='Năm sử dụng' name='yearInUse' className='mb-5'
            rules={[
              { pattern: /^[0-9]*$/, message: 'Năm sử dụng phải là số' }, { min: 4, max: 4, message: 'Năm sản xuất phải có 4 chữ số!' },
            ]}
          >
            <Input placeholder='Nhập năm sử dụng của thiết bị' allowClear className='input' />
          </Form.Item>
          <Form.Item label='Dự án' name='projectId' className='mb-5'>
            <Select
              showSearch
              placeholder='Chọn dự án'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(projects)}
            >
            </Select>
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label='Ghi chú' name='note' className='mb-5'>
            <TextArea placeholder='Ghi chú' rows={4} className='textarea' />
          </Form.Item>
          <Form.Item label='Quy trình sử dụng' name='usageProcedure' className='mb-5'>
            <TextArea placeholder='Quy trình sử dụng' rows={4} className='textarea' />
          </Form.Item>
        </div>
        <Form.Item>
          <Button className='button' htmlType='submit' loading={loading}>Thêm</Button>
        </Form.Item>
      </Form>
      <div className='basis-1/3 mt-4 flex flex-col items-center'>
        <div className='text-center mb-4'>Ảnh đại diện</div>
        <div className='preview-content'>
          <input
            type='file'
            hidden
            className='form-control'
            id='inputImage'
            onChange={(e: any) => handleChangeImg(e)}
          />
          <label className='text-center' htmlFor='inputImage'>
            {image === '' ? <img src={ava} alt='ava' className='w-52 h-52' /> : <div
              className='w-52 h-52 bg-center bg-no-repeat bg-cover'
              style={{ backgroundImage: `url(${selectedImage})` }}
            >
            </div>}
          </label>
        </div>
      </div>
      ;
    </div>
  </div>);
};

export default CreateEquipment;

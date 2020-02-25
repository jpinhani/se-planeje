import React from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';

const data = [];

// function teste() {
//   fetch('http://localhost:8082/api/naturezas/')
//     .then(response => response.json())
//     .then(natureza => console.warn(narurezas))
// }

// const endpointAPI = 'http://localhost:8082/api/naturezas/'
// axios.get(endpointAPI).then(function (result) {
//   for (let i = 0; i < 5; i++) {
//     console.log(result)
//     data.push({
//       key: i.toString(),
//       descrNatureza: `Edrward ${i}`,
//       status: `Ativo`,
//       // address: `London Park no. ${i}`,
//     });
//   }
// }).catch(function (err) {
//   console.log(err)
// })

for (let i = 0; i < 5; i++) {


  data.push({
    key: i.toString(),
    descrNatureza: `Edrward ${i}`,
    status: `Ativo`,
    // address: `London Park no. ${i}`,
  });
}

// function handleget(event) {
//   event.preventDefault()

//   const endpointAPI = 'http://localhost:8082/api/naturezas/'

//   axios.post(endpointAPI).then(function (result) {
//     console.log(result)
//   }).catch(function (err) {
//     console.log(err)
//   })

// }

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: 'Descr Conta',
        dataIndex: 'descrNatureza',
        width: '25%',
        editable: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width: '15%',
        editable: true,
      },
      // {
      //   title: 'address',
      //   dataIndex: 'address',
      //   width: '40%',
      //   editable: true,
      // },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                Edit
            </a>
            );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const SelectConta = Form.create()(EditableTable);

// ReactDOM.render(<EditableFormTable />, mountNode);
export default SelectConta
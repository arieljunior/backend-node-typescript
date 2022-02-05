import express, {Express, Request, Response} from 'express';

const app: Express = express();

const PORT = 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const students: {
  id: number;
  name: string;
  age: number;
}[] = [
  {
    id: 1,
    name: "renan",
    age: 28,
  },
  {
    id: 2,
    name: "brunno",
    age: 30,
  },
];


enum STATUS_MESSAGE_REQUEST {
    STUDENT_NOT_FOUND = 'student not found',
    STUDENT_CREATED = 'student created',
    STUDENT_DELETED = 'student deleted',
    STUDENT_UPDATED = 'student updated',
}

enum MESSAGE_ERROR_REQUEST {
    BODY_INVALID = 'body invalid'
}

const isBodyValid = (body: any): boolean => {
    return !body.name || !body.age || typeof body.name !== 'string' || typeof body.age !== 'number' || Object.keys(body).length !== 2;
}

app.get('/students', (req: Request, res: Response) => {
    res.status(200).send(students);
});

app.get('/student/:id', (req: Request, res: Response) => {
    const {id} = req.params;

    const student = students.find( student => student.id === Number(id));

    if(student){
        res.status(200).send(student);
    }else{
        res.status(404).send('student not found');
    }
});

app.post('/student', (req: Request, res: Response) => {
    const {body} = req;

    if(!isBodyValid(body)){
        res.status(200).send({
            status: MESSAGE_ERROR_REQUEST.BODY_INVALID,
        });
        return;
    }

    students.push({
        ...body,
        id: students.length + 1
    });

    res.status(200).send({
        status: STATUS_MESSAGE_REQUEST.STUDENT_CREATED,
        data: students[students.length -1]
    });
    
});

app.delete('/student/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const index = students.findIndex( student => student.id === Number(id));

    if(index === -1){
        res.status(404).send({
            status: 'student not found'
        });
        return
    }

    const student = students.splice(index);

    res.status(200).send({
        status: 'deleted',
        data: student
    });
    
});

app.put('/student/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;

    const index = students.findIndex( student => student.id === Number(id));

    if(index === -1){
        res.status(404).send({
            status: STATUS_MESSAGE_REQUEST.STUDENT_NOT_FOUND,
        });
        return;
    }

    if(isBodyValid(body)){
        res.status(500).send({
            status: MESSAGE_ERROR_REQUEST.BODY_INVALID,
        });
        return;
    }


    students[index] = {...students[index], ...body};

    res.status(200).send({
        status: STATUS_MESSAGE_REQUEST.STUDENT_UPDATED,
        data: students[index]
    });
    
});

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));
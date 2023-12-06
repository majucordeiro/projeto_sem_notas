const KEY_BD = '@usuariosestudo'

var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}

var FILTRO = ''

function cor(){
    var cor = document.getElementById('cor').value;
    document.getElementById('status').style.backgroundColor = 'green';
}

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.funcao) || expReg.test( usuario.curso) || expReg.test(usuario.validade) || expReg( usuario.status )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.funcao}</td>
                        <td>${usuario.curso}</td>
                        <td>${usuario.validade}</td>
                        <td>${usuario.status}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(nome, funcao, curso, validade, status){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, funcao, curso, validade, status
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, funcao, curso, validade, status){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.funcao = funcao;
    usuario.curso = curso;
    usuario.validade = validade;
    usuario.status = status;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id 
        
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Clique em OK para confirmar a exclusão do ID: '+id+"")){
        deleteUsuario(id)
    }
}


function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('funcao').value = ''
    document.getElementById('curso').value = ''
    document.getElementById('validade').value = ''
    document.getElementById('status').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('funcao').value = usuario.funcao
                document.getElementById('curso').value = usuario.curso
                document.getElementById('validade').value = usuario.validade
                document.getElementById('status').value = usuario.status;

            }
        }
        document.getElementById('nome').focus()
        document.getElementById('funcao').focus()
        document.getElementById('curso').focus()
        document.getElementById('validade').focus()
        document.getElementById('status').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        funcao: document.getElementById('funcao').value,
        curso: document.getElementById('curso').value,
        validade: document.getElementById('validade').value,
        status: document.getElementById('status').value,
    }
    if(data.id){
        editUsuario(data.id, data.nome, data.funcao, data.curso, data.validade, data.status)
    }else{
        insertUsuario( data.nome, data.funcao, data.curso, data.validade, data.status)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})
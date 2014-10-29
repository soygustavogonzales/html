                                    
                                    document.Form_datos.nombre.focus();
                                    document.Form_datos.sexo[0].checked();
                                    
		function usuario(nombre,apellido){
	 		this.nombre=nombre;
	 		this.apellido=apellido;
			
		}
		var newUser2 = new usuario('gloria','davalos');
		var newUser= new usuario();
		function new_user(nombre,apellido){
		newUser.nombre=nombre;
		newUser.apellido=apellido;
		// alert('Usuario guardado correctamente...'+newUser.nombre);
		}
                                    
		new_user('gustavo','gonzales');
		function mostrar(){
			document.write('El dato es: '+newUser2.nombre);

		}
	
		function validarCel(dato){
			var dato1= new Number(dato);
                                            if (dato!="" ){
			if(isNaN(dato1)==true ){
					alert('el dato no es un numero :'+dato);

				}
                                                   }else{alert("Dato obligatorio")
                                                             document.Form_datos.celular.focus();
                                               
                                                    }
                                }
                                /**
 * Comment
 */
function validarNom(dato) {
    var dato1=new String(dato);
    if(dato!=""){
        
    }else{
        alert("Dato obligatorio");
        document.Form_datos.nombre.focus();
    }

}
function validarApe(dato) {
    var dato1=new String(dato);
    if(dato!=""){
        
    }else{
        alert("Dato obligatorio");
        document.Form_datos.nombre.focus();
    }

}
function validarSex(){
    if (Form_datos.sexo[0].checked==false) {/*Si no esta seleccionado esta opcion*/
       // if (Form_datos.sexo[1].checked==false)/*si tampoco esta selccionada esta opcion*/
           { alert("debe seleccionar al menos una opcion en SEXO")
        } 
    }
    else{ }
    
    
}


	